import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code')?.trim().toUpperCase();
    const pin = searchParams.get('pin')?.trim();

    if (!code || !pin) {
      return NextResponse.json({ success: false, error: 'Gift card code and security PIN are required' }, { status: 400 });
    }

    await dbConnect();
    const GiftCard = (await import('@/models/GiftCard')).default;
    const User = (await import('@/models/User')).default;

    const giftCard = await GiftCard.findOne({ code, pin });
    if (!giftCard) {
      return NextResponse.json({ success: false, error: 'Invalid gift card code or security PIN' }, { status: 404 });
    }

    if (giftCard.status === 'cancelled') {
      return NextResponse.json({ success: false, error: 'This gift card has been cancelled' }, { status: 400 });
    }

    if (giftCard.status === 'pending') {
      return NextResponse.json({ success: false, error: 'This gift card has not been activated yet' }, { status: 400 });
    }

    // Set opened timestamp if first time
    if (!giftCard.openedAt) {
      giftCard.openedAt = new Date();
      await giftCard.save();
    }

    // Find sender name
    let senderName = 'A Generous Friend';
    if (giftCard.senderUserId) {
      const sender = await User.findById(giftCard.senderUserId);
      if (sender && sender.name) {
        senderName = sender.name;
      }
    } else if (giftCard.createdByAdmin) {
      senderName = 'Luxury Jewelry Curator';
    }

    return NextResponse.json({
      success: true,
      data: {
        senderName,
        recipientName: giftCard.recipientName,
        recipientEmail: giftCard.recipientEmail,
        initialAmount: giftCard.initialAmount,
        currentBalance: giftCard.currentBalance,
        personalMessage: giftCard.personalMessage,
        theme: giftCard.theme || 'Minimal Luxury',
        currency: giftCard.currency || 'INR',
        expirationDate: giftCard.expirationDate,
        status: giftCard.status
      }
    });

  } catch (error: any) {
    console.error('[GIFT CARD REVEAL API] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
