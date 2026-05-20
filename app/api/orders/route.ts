import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';
import { sendOrderConfirmationEmail, sendAdminNewOrderEmail } from '@/lib/mail';
import { secureCalculateOrderTotal } from '@/lib/pricing.server';
import { z } from 'zod';

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

    const { items: rawItems, shippingAddress, couponCode, currency, exchangeRate } = validation.data;

    await dbConnect();

    // 2. SECURE RE-CALCULATION (Server-Side Only)
    // We ignore any price data from the client and re-calculate based on DB
    const pricingResult = await secureCalculateOrderTotal(rawItems, couponCode);

    const orderData = {
      userId: session?.user ? (session.user as any).id : undefined,
      items: pricingResult.items, // Use snapshot from pricing engine
      totalAmount: pricingResult.totalAmount,
      discountAmount: pricingResult.discountAmount,
      couponCode: pricingResult.couponCode,
      currency: currency,
      exchangeRate: exchangeRate,
      shippingAddress,
      paymentStatus: 'pending',
      orderStatus: 'placed',
    };

    const order = await Order.create(orderData);

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

    return NextResponse.json({ 
      success: true, 
      orderId: order._id,
      amount: pricingResult.totalAmount // Return server-calculated amount for confirmation
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
