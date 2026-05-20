import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    await dbConnect();

    // 1. FETCH ORDER FROM DB (Never trust frontend amount)
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. USE SECURE SERVER-CALCULATED AMOUNT
    const totalAmount = order.totalAmount;

    // Razorpay amount is in subunits (paise for INR)
    const options = {
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `receipt_${orderId}`,
      metadata: {
        orderId: orderId
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Update order with Razorpay ID for tracking
    await Order.findByIdAndUpdate(orderId, { razorpayOrderId: razorpayOrder.id });

    return NextResponse.json({
      success: true,
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
    
  } catch (error: any) {
    console.error('Secure Razorpay Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
