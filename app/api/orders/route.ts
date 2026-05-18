import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';
import { sendOrderConfirmationEmail, sendAdminNewOrderEmail } from '@/lib/mail';

// POST: Create a new pending order
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { items, totalAmount, shippingAddress, couponCode, discountAmount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    await dbConnect();

    const orderData = {
      userId: session?.user ? (session.user as any).id : undefined,
      items,
      totalAmount,
      discountAmount: discountAmount || 0,
      couponCode: couponCode || undefined,
      currency: body.currency || 'INR',
      exchangeRate: body.exchangeRate || 1,
      shippingAddress,
      paymentStatus: 'pending',
      orderStatus: 'placed',
    };

    const order = await Order.create(orderData);

    // If a coupon was used, increment its usage count
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase() },
        { $inc: { usedCount: 1 } }
      );
    }

    // Trigger Email Workflow (Async - Don't wait for response to confirm order creation)
    if (session?.user?.email) {
      sendOrderConfirmationEmail(order, session.user.email).catch(err => console.error('Order Email Error:', err));
      sendAdminNewOrderEmail(order).catch(err => console.error('Admin Email Error:', err));
    }

    return NextResponse.json({ success: true, orderId: order._id });
  } catch (error: any) {
    console.error('Order Creation Error:', error);
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
