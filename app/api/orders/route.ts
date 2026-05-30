import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';
import { sendOrderConfirmationEmail, sendAdminNewOrderEmail } from '@/lib/mail';
import { secureCalculateOrderTotal } from '@/lib/pricing.server';
import { z } from 'zod';
import { razorpay } from '@/lib/razorpay';
import { getEligibleRedemptionAmount, lockWalletBalance } from '@/lib/digiGoldRedemption';

// Input Validation Schema
const OrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    configuration: z.object({
      metal: z.string(),
      purity: z.string(),
      size: z.string().optional(),
      stone: z.string().optional(),
    })
  })),
  shippingAddress: z.object({
    fullName: z.string(),
    phone: z.string(),
    addressLine: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    country: z.string(),
  }),
  couponCode: z.string().optional(),
  currency: z.string().default('INR'),
  exchangeRate: z.number().default(1),
  applyDigiGold: z.boolean().default(false),
  giftCardCode: z.string().optional(),
  giftCardPin: z.string().optional(),
});

// POST: Create a new pending order
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    // 1. Validate Input Structure
    const validation = OrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid order data', details: validation.error.format() }, { status: 400 });
    }

    const { items: rawItems, shippingAddress, couponCode, currency, exchangeRate, applyDigiGold, giftCardCode, giftCardPin } = validation.data;

    await dbConnect();

    // 2. SECURE RE-CALCULATION (Server-Side Only)
    const pricingResult = await secureCalculateOrderTotal(rawItems, couponCode);
    let finalPayableAmount = pricingResult.totalAmount;
    let digiGoldRedeemedAmount = 0;
    let digiGoldRedeemedGrams = 0;
    let digiGoldTxId = null;

    // 3. DIGI GOLD REDEMPTION LOGIC
    if (applyDigiGold && session?.user) {
      const userId = (session.user as any).id;
      const eligible = await getEligibleRedemptionAmount(userId);
      
      if (eligible.amount > 0) {
        // Can only redeem up to the total order amount
        digiGoldRedeemedAmount = Math.min(eligible.amount, finalPayableAmount);
        finalPayableAmount = finalPayableAmount - digiGoldRedeemedAmount;
      }
    }

    // 4. GIFT CARD REDEMPTION LOGIC
    let giftCardRedeemedAmount = 0;
    let appliedGiftCardCode = '';

    if (giftCardCode && giftCardPin) {
      const GiftCard = (await import('@/models/GiftCard')).default;

      const gc = await GiftCard.findOne({ 
        code: giftCardCode.trim().toUpperCase(),
        pin: giftCardPin.trim()
      });

      if (!gc) {
        return NextResponse.json({ error: 'Invalid Gift Card code or PIN' }, { status: 400 });
      }

      if (gc.status === 'pending') {
        return NextResponse.json({ error: 'This gift card is not yet activated' }, { status: 400 });
      }
      if (gc.status === 'redeemed' || gc.currentBalance <= 0) {
        return NextResponse.json({ error: 'This gift card has already been fully redeemed' }, { status: 400 });
      }
      if (['cancelled', 'expired'].includes(gc.status)) {
        return NextResponse.json({ error: `This gift card is ${gc.status}` }, { status: 400 });
      }
      if (gc.expirationDate && new Date(gc.expirationDate) < new Date()) {
        return NextResponse.json({ error: 'This gift card has expired' }, { status: 400 });
      }
      if (gc.currency !== currency) {
        return NextResponse.json({ error: `Currency mismatch: Gift Card is in ${gc.currency}` }, { status: 400 });
      }

      giftCardRedeemedAmount = Math.min(gc.currentBalance, finalPayableAmount);

      if (giftCardRedeemedAmount > 0) {
        // Atomic deduction
        const updatedGC = await GiftCard.findOneAndUpdate(
          {
            _id: gc._id,
            currentBalance: { $gte: giftCardRedeemedAmount }
          },
          {
            $inc: { currentBalance: -giftCardRedeemedAmount },
            $set: {
              status: (gc.currentBalance - giftCardRedeemedAmount === 0) ? 'redeemed' : 'partially_redeemed',
              lastUsedAt: new Date()
            }
          },
          { new: true }
        );

        if (!updatedGC) {
          return NextResponse.json({ error: 'Gift card balance check failed (potential double spend)' }, { status: 400 });
        }

        finalPayableAmount -= giftCardRedeemedAmount;
        appliedGiftCardCode = gc.code;
      }
    }

    const orderData = {
      userId: session?.user ? (session.user as any).id : undefined,
      items: pricingResult.items,
      totalAmount: pricingResult.totalAmount, // Original total
      discountAmount: pricingResult.discountAmount,
      couponCode: pricingResult.couponCode,
      currency: currency,
      exchangeRate: exchangeRate,
      shippingAddress,
      digiGoldRedeemedAmount,
      giftCardCode: appliedGiftCardCode || undefined,
      giftCardAmountRedeemed: giftCardRedeemedAmount || undefined,
      paymentStatus: finalPayableAmount === 0 ? 'paid' : 'pending',
      orderStatus: finalPayableAmount === 0 ? 'Payment Confirmed' : 'placed',
    };

    let order;
    try {
      order = await Order.create(orderData);
    } catch (createErr: any) {
      // Revert Gift Card balance on creation failure
      if (giftCardRedeemedAmount > 0 && appliedGiftCardCode) {
        const GiftCard = (await import('@/models/GiftCard')).default;
        await GiftCard.findOneAndUpdate(
          { code: appliedGiftCardCode },
          {
            $inc: { currentBalance: giftCardRedeemedAmount },
            $set: { status: 'active' } // Fallback to active
          }
        );
      }
      throw createErr;
    }

    // Log Gift Card transaction if used successfully
    if (giftCardRedeemedAmount > 0 && appliedGiftCardCode && order) {
      const GiftCard = (await import('@/models/GiftCard')).default;
      const GiftCardTransaction = (await import('@/models/GiftCardTransaction')).default;
      const gc = await GiftCard.findOne({ code: appliedGiftCardCode });

      await GiftCardTransaction.create({
        giftCardId: gc._id,
        type: 'redeemed',
        amount: giftCardRedeemedAmount,
        balanceBefore: gc.currentBalance + giftCardRedeemedAmount,
        balanceAfter: gc.currentBalance,
        relatedOrderId: order._id,
        actorUserId: session?.user ? (session.user as any).id : undefined,
        metadata: { notes: 'Redeemed at checkout' }
      });
    }

    // Lock Digi Gold if used
    if (digiGoldRedeemedAmount > 0 && session?.user && order) {
      const lockResult = await lockWalletBalance((session.user as any).id, order._id.toString(), digiGoldRedeemedAmount);
      order.digiGoldRedeemedGrams = lockResult.lockedGrams;
      order.digiGoldTransactionId = lockResult.transactionId as any;
      await order.save();
    }

    // If a coupon was used, increment its usage count
    if (pricingResult.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: pricingResult.couponCode },
        { $inc: { usedCount: 1 } }
      );
    }

    // Trigger Email Workflow (Async)
    if (session?.user?.email) {
      sendOrderConfirmationEmail(order, session.user.email).catch(err => console.error('Order Email Error:', err));
      sendAdminNewOrderEmail(order).catch(err => console.error('Admin Email Error:', err));
    }

    // If 100% redeemed via Digi Gold, skip Razorpay!
    if (finalPayableAmount === 0) {
      // NOTE: Because Razorpay webhook won't fire, we must finalize the redemption immediately.
      if (order.digiGoldRedeemedAmount > 0) {
        const { finalizeRedemption } = await import('@/lib/digiGoldRedemption');
        await finalizeRedemption(order.userId.toString(), order._id.toString());
      }
      return NextResponse.json({ 
        success: true, 
        orderId: order._id,
        fullyRedeemed: true
      });
    }

    // Otherwise, Generate Razorpay Order for remaining amount
    const options = {
      amount: Math.round(finalPayableAmount * 100), // Razorpay accepts smallest currency unit (paise)
      currency: currency || 'INR',
      receipt: order._id.toString()
    };
    const razorpayOrder = await razorpay.orders.create(options);

    // Save Razorpay Order ID to DB
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return NextResponse.json({ 
      success: true, 
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: options.amount // Return in paise for frontend SDK
    });
  } catch (error: any) {
    console.error('Secure Order Creation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: Fetch order history for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const orders = await Order.find({ userId: (session.user as any).id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
