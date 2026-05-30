import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { verifyRazorpaySignature } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      orderId // MongoDB Order ID
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 1. Verify Signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature. Verification failed.' }, { status: 400 });
    }

    // 2. Update Database Order
    await dbConnect();
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
       return NextResponse.json({ error: 'Razorpay Order ID mismatch' }, { status: 400 });
    }

    // Mark as paid
    order.paymentStatus = 'paid';
    order.orderStatus = 'Payment Confirmed';
    
    // Add to timeline
    order.timeline.push({
      status: 'Payment Confirmed',
      date: new Date(),
      notes: `Verified Razorpay Payment ID: ${razorpay_payment_id}`
    });

    await order.save();

    // Activate Gift Card if it is a virtual gift card purchase
    if (order.items[0]?.productId === 'giftcard_virtual') {
      const { activateGiftCardForOrder } = await import('@/lib/giftCardHelper');
      try {
        await activateGiftCardForOrder(order._id.toString());
      } catch (gcErr) {
        console.error('[GIFT CARD] Activation error in verification route:', gcErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Payment verified successfully' });
  } catch (error: any) {
    console.error('Razorpay Verification Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
