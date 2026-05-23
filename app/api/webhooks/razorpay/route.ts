import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import PlanTransaction from '@/models/PlanTransaction';
import PlanEnrollment from '@/models/PlanEnrollment';
import DigitalGoldSIP from '@/models/DigitalGoldSIP';
import DigitalGoldSIPInstallment from '@/models/DigitalGoldSIPInstallment';
import DigitalGoldTransaction from '@/models/DigitalGoldTransaction';
import DigitalGoldWallet from '@/models/DigitalGoldWallet';
import ProcessedWebhook from '@/models/ProcessedWebhook';
import FinancialAuditLog from '@/models/FinancialAuditLog';
import { finalizeRedemption, unlockWalletBalance } from '@/lib/digiGoldRedemption';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    await dbConnect();

    // Idempotency Check
    const existingEvent = await ProcessedWebhook.findOne({ eventId: event.id });
    if (existingEvent) {
      console.log(`Webhook event ${event.id} already processed.`);
      return NextResponse.json({ success: true, message: 'Event already processed' });
    }

    let isHandled = false;

    // Handle Ecommerce Payment Success
    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;

      // 1. Check if it's an Ecommerce Order
      const order = await Order.findOne({ razorpayOrderId: orderId });
      if (order) {
        if (order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          order.orderStatus = 'Payment Confirmed';
          order.timeline.push({
            status: 'Payment Confirmed',
            date: new Date(),
            notes: `Webhook verified Razorpay Payment ID: ${paymentEntity.id}`
          });
          await order.save();

          // Finalize Digi Gold Redemption if applicable
          if (order.digiGoldRedeemedAmount && order.digiGoldRedeemedAmount > 0) {
            try {
              await finalizeRedemption(order.userId.toString(), order._id.toString());
              console.log(`Successfully finalized Digi Gold redemption for order ${order._id}`);
            } catch (err) {
              console.error(`Failed to finalize redemption for order ${order._id}:`, err);
            }
          }
        }
        isHandled = true;
      }

      // 2. Check if it's a Finance Plan Transaction
      const transaction = await PlanTransaction.findOne({ gatewayReference: orderId });
      if (transaction) {
        if (transaction.status !== 'success') {
          transaction.status = 'success';
          transaction.paidAt = new Date();
          await transaction.save();

          const enrollment = await PlanEnrollment.findById(transaction.enrollmentId);
          if (enrollment && enrollment.status !== 'active') {
            enrollment.status = 'active';
            enrollment.installmentsPaid += 1;
            enrollment.totalAmountPaid += transaction.amount;
            if (transaction.goldUnitsAdded) {
              enrollment.accumulatedGoldGrams += transaction.goldUnitsAdded;
            }
            await enrollment.save();
          }
        }
        isHandled = true;
      }

      // 3. Check if it's a Digi Gold Wallet Buy Transaction
      const digiGoldTx = await DigitalGoldTransaction.findOne({ razorpayOrderId: orderId });
      if (digiGoldTx && digiGoldTx.status !== 'success') {
        digiGoldTx.status = 'success';
        digiGoldTx.razorpayPaymentId = paymentEntity.id;
        await digiGoldTx.save();

        const wallet = await DigitalGoldWallet.findById(digiGoldTx.walletId);
        if (wallet) {
          if (digiGoldTx.type === 'buy') {
            wallet.totalGrams += digiGoldTx.goldGrams;
            wallet.totalInvestment += digiGoldTx.rupeeAmount;
            await wallet.save();

            // Audit Log
            await FinancialAuditLog.create({
              actor: 'SYSTEM_WEBHOOK',
              action: 'WALLET_CREDIT_BUY',
              entityType: 'DigitalGoldWallet',
              entityId: wallet._id.toString(),
              beforeValue: wallet.totalGrams - digiGoldTx.goldGrams,
              afterValue: wallet.totalGrams,
              metadata: { transactionId: digiGoldTx._id, razorpayOrderId: orderId }
            });
          }
        }
        isHandled = true;
      }

      // 4. Check if it's a SIP Installment Payment
      const sipInstallment = await DigitalGoldSIPInstallment.findOne({ razorpayOrderId: orderId });
      if (sipInstallment && sipInstallment.status !== 'paid') {
        sipInstallment.status = 'paid';
        sipInstallment.paidAt = new Date();
        await sipInstallment.save();

        const sip = await DigitalGoldSIP.findById(sipInstallment.sipId);
        if (sip) {
          sip.installmentsPaid += 1;
          
          // Auto-generate next installment
          const nextMonth = new Date(sip.nextDueDate);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          sip.nextDueDate = nextMonth;
          
          await sip.save();

          // Calculate gold credited based on live rate (which is done via regular buy tx)
          // To keep it clean, we create a DigitalGoldTransaction for the SIP payment
          const { getLiveGoldRate } = await import('@/lib/goldRates');
          const liveRate = await getLiveGoldRate();
          const executionRate = liveRate ? liveRate.sellRate24K : 7000;
          const gramsPurchased = sipInstallment.amount / executionRate;
          
          const wallet = await DigitalGoldWallet.findOne({ userId: sip.userId });
          if (wallet) {
            const tx = await DigitalGoldTransaction.create({
              walletId: wallet._id,
              userId: sip.userId,
              type: 'buy',
              rupeeAmount: sipInstallment.amount,
              goldGrams: gramsPurchased,
              goldRateAtExecution: executionRate,
              status: 'success',
              razorpayPaymentId: paymentEntity.id,
              metadata: { source: 'SIP_INSTALLMENT', sipId: sip._id }
            });
            
            sipInstallment.linkedTransactionId = tx._id;
            await sipInstallment.save();

            wallet.totalGrams += gramsPurchased;
            wallet.totalInvestment += sipInstallment.amount;
            await wallet.save();

            sip.totalInvested += sipInstallment.amount;
            sip.totalGramsAccumulated += gramsPurchased;
            await sip.save();

            // Audit Log
            await FinancialAuditLog.create({
              actor: 'SYSTEM_WEBHOOK',
              action: 'WALLET_CREDIT_SIP',
              entityType: 'DigitalGoldWallet',
              entityId: wallet._id.toString(),
              beforeValue: wallet.totalGrams - gramsPurchased,
              afterValue: wallet.totalGrams,
              metadata: { sipId: sip._id, installmentId: sipInstallment._id, transactionId: tx._id }
            });
          }
        }
        isHandled = true;
      }
    }

    // Handle Payment Failure
    if (event.event === 'payment.failed') {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      
      const order = await Order.findOne({ razorpayOrderId: orderId });
      if (order) {
        order.paymentStatus = 'failed';
        await order.save();

        // Unlock Digi Gold if it was locked for this order
        if (order.digiGoldRedeemedAmount && order.digiGoldRedeemedAmount > 0) {
          try {
            await unlockWalletBalance(order.userId.toString(), order._id.toString());
            console.log(`Successfully unlocked Digi Gold balance for failed order ${order._id}`);
          } catch (err) {
            console.error(`Failed to unlock Digi Gold balance for order ${order._id}:`, err);
          }
        }

        isHandled = true;
      }

      const transaction = await PlanTransaction.findOne({ gatewayReference: orderId });
      if (transaction) {
        transaction.status = 'failed';
        await transaction.save();
        isHandled = true;
      }

      const digiGoldTx = await DigitalGoldTransaction.findOne({ razorpayOrderId: orderId });
      if (digiGoldTx) {
        digiGoldTx.status = 'failed';
        await digiGoldTx.save();
        isHandled = true;
      }

      const sipInstallment = await DigitalGoldSIPInstallment.findOne({ razorpayOrderId: orderId });
      if (sipInstallment) {
        sipInstallment.status = 'failed';
        await sipInstallment.save();
        isHandled = true;
      }
    }

    // Mark as processed
    await ProcessedWebhook.create({
      eventId: event.id,
      event: event.event,
      status: isHandled ? 'processed' : 'ignored'
    });

    return NextResponse.json({ success: true, message: isHandled ? 'Event processed' : 'Event ignored' });
  } catch (error: any) {
    console.error('Razorpay Webhook Error:', error);
    
    // Log fatal webhook error
    try {
      await dbConnect();
      await FinancialAuditLog.create({
        actor: 'SYSTEM',
        action: 'WEBHOOK_FATAL_ERROR',
        entityType: 'System',
        metadata: { error: error.message }
      });
    } catch (e) {}

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
