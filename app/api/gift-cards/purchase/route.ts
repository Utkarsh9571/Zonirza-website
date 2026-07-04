import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import GiftCard from '@/models/GiftCard';
import Order from '@/models/Order';
import { generateUniqueCode, generateSecurePin } from '@/lib/giftCardHelper';
import { razorpay } from '@/lib/razorpay';
import { z } from 'zod';

const PurchaseSchema = z.object({
  amount: z.number().min(100, 'Minimum gift card purchase value is ₹100'),
  recipientEmail: z.string().email('Invalid email address'),
  recipientName: z.string().min(2, 'Recipient name is too short'),
  personalMessage: z.string().max(500, 'Personal message is too long').optional(),
  currency: z.string().default('INR'),
  theme: z.string().optional(),
  scheduledAt: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Authentication is required to purchase gift cards' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();

    const validation = PurchaseSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Invalid input data', details: validation.error.format() }, { status: 400 });
    }

    const { amount, recipientEmail, recipientName, personalMessage, currency, theme, scheduledAt } = validation.data;

    await dbConnect();

    // 1. Generate code and PIN
    const giftCardCode = await generateUniqueCode();
    const giftCardPin = generateSecurePin();

    // Set expiration date (1 year from now)
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    // 2. Create the virtual Order representing this purchase
    const orderData = {
      userId,
      items: [
        {
          productId: 'giftcard_virtual',
          name: `Luxury Jewelry Gift Card — ₹${amount.toLocaleString()}`,
          slug: 'giftcard',
          price: amount,
          quantity: 1,
          image: '/images/giftcard_gold.png',
          configuration: {
            metal: 'Gold',
            purity: '24K',
          },
        },
      ],
      totalAmount: amount,
      discountAmount: 0,
      currency,
      exchangeRate: 1,
      shippingAddress: {
        fullName: recipientName,
        phone: '0000000000',
        addressLine: `Virtual Delivery via Email: ${recipientEmail}`,
        city: 'Virtual Delivery',
        state: 'Virtual',
        pincode: '000000',
        country: 'India',
      },
      paymentStatus: 'pending',
      orderStatus: 'placed',
      timeline: [
        {
          status: 'placed',
          date: new Date(),
          notes: 'Gift Card purchase initiated',
        },
      ],
    };

    const order = await Order.create(orderData);

    // 3. Create the GiftCard in 'pending' status
    const giftCard = await GiftCard.create({
      code: giftCardCode,
      pin: giftCardPin,
      initialAmount: amount,
      currentBalance: amount,
      currency,
      senderUserId: userId,
      recipientEmail: recipientEmail.toLowerCase(),
      recipientName,
      personalMessage,
      status: 'pending',
      purchasedOrderId: order._id,
      expirationDate,
      createdByUser: true,
      createdByAdmin: false,
      theme: theme || 'Minimal Luxury',
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      scheduledFor: scheduledAt ? new Date(scheduledAt) : undefined,
      deliveryChannel: 'email',
    });

    // 4. Generate Razorpay Order
    const options = {
      amount: Math.round(amount * 100), // paise
      currency: currency || 'INR',
      receipt: order._id.toString(),
    };
    
    let razorpayOrderId = '';
    try {
      const razorpayOrder = await razorpay.orders.create(options);
      razorpayOrderId = razorpayOrder.id;

      // Update Order and GiftCard with Razorpay Order ID
      order.razorpayOrderId = razorpayOrderId;
      await order.save();
    } catch (rzpErr: any) {
      console.error('Razorpay Order Creation Error for Gift Card:', rzpErr);
      // Clean up order and gift card if Razorpay fails
      await Order.findByIdAndDelete(order._id);
      await GiftCard.findByIdAndDelete(giftCard._id);
      return NextResponse.json({ success: false, error: 'Payment gateway initialization failed. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      orderId: order._id,
      razorpayOrderId,
      amount: amount * 100, // in paise for frontend Razorpay SDK
      giftCardId: giftCard._id,
    });
  } catch (error: any) {
    console.error('Gift Card Purchase Initialization Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
