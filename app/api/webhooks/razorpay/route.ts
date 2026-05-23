import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import PlanTransaction from '@/models/PlanTransaction';
import PlanEnrollment from '@/models/PlanEnrollment';

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
        }
        return NextResponse.json({ success: true, message: 'Ecommerce order updated' });
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
        return NextResponse.json({ success: true, message: 'Finance transaction updated' });
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
        return NextResponse.json({ success: true, message: 'Ecommerce order marked as failed' });
      }

      const transaction = await PlanTransaction.findOne({ gatewayReference: orderId });
      if (transaction) {
        transaction.status = 'failed';
        await transaction.save();
        return NextResponse.json({ success: true, message: 'Finance transaction marked as failed' });
      }
    }

    return NextResponse.json({ success: true, message: 'Event ignored' });
  } catch (error: any) {
    console.error('Razorpay Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
