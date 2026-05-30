import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import GiftCard from '@/models/GiftCard';
import GiftCardTransaction from '@/models/GiftCardTransaction';
import { generateUniqueCode, generateSecurePin } from '@/lib/giftCardHelper';
import { sendGiftCardEmail } from '@/lib/mail';
import { z } from 'zod';

const AdminCreateSchema = z.object({
  initialAmount: z.number().min(10, 'Minimum amount is 10'),
  currency: z.string().default('INR'),
  recipientEmail: z.string().email('Invalid email address'),
  recipientName: z.string().min(2, 'Name is too short'),
  personalMessage: z.string().optional(),
  expirationDate: z.string().optional(), // Date string
  theme: z.string().optional(),
  scheduledAt: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized administrative access' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const status = searchParams.get('status') || '';

    const filter: any = {};
    if (status) filter.status = status;
    if (query) {
      filter.$or = [
        { code: { $regex: query, $options: 'i' } },
        { recipientEmail: { $regex: query, $options: 'i' } },
        { recipientName: { $regex: query, $options: 'i' } }
      ];
    }

    const giftCards = await GiftCard.find(filter)
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: giftCards });
  } catch (error: any) {
    console.error('Admin Gift Cards Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized administrative access' }, { status: 401 });
    }

    const adminUserId = (session.user as any).id;
    const body = await req.json();

    const validation = AdminCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Invalid data parameters', details: validation.error.format() }, { status: 400 });
    }

    const { initialAmount, currency, recipientEmail, recipientName, personalMessage, expirationDate, theme, scheduledAt } = validation.data;

    await dbConnect();

    // 1. Generate code & PIN
    const code = await generateUniqueCode();
    const pin = generateSecurePin();

    // Set expiration (default 1 year if not provided)
    let expDate = new Date();
    if (expirationDate) {
      expDate = new Date(expirationDate);
    } else {
      expDate.setFullYear(expDate.getFullYear() + 1);
    }

    const isFutureScheduled = scheduledAt && new Date(scheduledAt) > new Date();

    // 2. Create (activated immediately unless scheduled for future)
    const giftCard = await GiftCard.create({
      code,
      pin,
      initialAmount,
      currentBalance: initialAmount,
      currency,
      recipientEmail: recipientEmail.toLowerCase(),
      recipientName,
      personalMessage,
      status: isFutureScheduled ? 'pending' : 'active',
      expirationDate: expDate,
      createdByAdmin: true,
      createdByUser: false,
      issuedAt: isFutureScheduled ? undefined : new Date(),
      theme: theme || 'Minimal Luxury',
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      scheduledFor: scheduledAt ? new Date(scheduledAt) : undefined,
      deliveryStatus: isFutureScheduled ? 'pending' : 'delivered',
      deliveredAt: isFutureScheduled ? undefined : new Date(),
      deliveryChannel: 'email',
    });

    // 3. Log transaction
    if (!isFutureScheduled) {
      await GiftCardTransaction.create({
        giftCardId: giftCard._id,
        type: 'issued',
        amount: initialAmount,
        balanceBefore: 0,
        balanceAfter: initialAmount,
        actorUserId: adminUserId,
        metadata: { notes: 'Issued manually by Admin' },
      });
    } else {
      await GiftCardTransaction.create({
        giftCardId: giftCard._id,
        type: 'adjusted',
        amount: 0,
        balanceBefore: 0,
        balanceAfter: 0,
        actorUserId: adminUserId,
        metadata: { notes: `Issued manually by Admin and queued for scheduled delivery on ${scheduledAt}` },
      });
    }

    // 4. Send email if not scheduled in future
    if (!isFutureScheduled) {
      try {
        await sendGiftCardEmail(giftCard, 'Zoniraz Curator');
      } catch (mailErr) {
        console.error('[ADMIN] Failed to send email for manual gift card:', mailErr);
      }
    }

    return NextResponse.json({ success: true, data: giftCard });
  } catch (error: any) {
    console.error('Admin Gift Card Creation Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized administrative access' }, { status: 401 });
    }

    const adminUserId = (session.user as any).id;
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Missing gift card ID or status parameter' }, { status: 400 });
    }

    await dbConnect();

    const giftCard = await GiftCard.findById(id);
    if (!giftCard) {
      return NextResponse.json({ success: false, error: 'Gift card not found' }, { status: 404 });
    }

    const oldStatus = giftCard.status;
    const oldBalance = giftCard.currentBalance;

    if (oldStatus === status) {
      return NextResponse.json({ success: true, data: giftCard });
    }

    // Toggle logic
    giftCard.status = status;
    await giftCard.save();

    // Log adjustment transaction
    await GiftCardTransaction.create({
      giftCardId: giftCard._id,
      type: 'adjusted',
      amount: 0,
      balanceBefore: oldBalance,
      balanceAfter: oldBalance,
      actorUserId: adminUserId,
      metadata: { notes: `Status changed manually by Admin from '${oldStatus}' to '${status}'` },
    });

    return NextResponse.json({ success: true, data: giftCard });
  } catch (error: any) {
    console.error('Admin Gift Card Toggle Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
