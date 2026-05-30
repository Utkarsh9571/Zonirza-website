import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GiftCard from '@/models/GiftCard';

export async function POST(req: NextRequest) {
  try {
    const { code, pin } = await req.json();

    if (!code || !pin) {
      return NextResponse.json({ success: false, error: 'Missing code or PIN' }, { status: 400 });
    }

    await dbConnect();

    const giftCard = await GiftCard.findOne({ code: code.trim().toUpperCase() });

    if (!giftCard || giftCard.pin !== pin.trim()) {
      return NextResponse.json({ success: false, error: 'Invalid Gift Card code or PIN' }, { status: 400 });
    }

    // Expiration check
    if (giftCard.expirationDate && new Date(giftCard.expirationDate) < new Date()) {
      return NextResponse.json({ success: false, error: 'This gift card has expired' }, { status: 400 });
    }

    // Status check
    if (giftCard.status === 'pending') {
      return NextResponse.json({ success: false, error: 'This gift card is not yet activated' }, { status: 400 });
    }
    if (giftCard.status === 'redeemed' || giftCard.currentBalance <= 0) {
      return NextResponse.json({ success: false, error: 'This gift card has already been fully redeemed' }, { status: 400 });
    }
    if (['cancelled', 'expired'].includes(giftCard.status)) {
      return NextResponse.json({ success: false, error: `This gift card is ${giftCard.status}` }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      code: giftCard.code,
      currentBalance: giftCard.currentBalance,
      currency: giftCard.currency,
      recipientName: giftCard.recipientName,
      senderUserId: giftCard.senderUserId,
    });
  } catch (error: any) {
    console.error('Gift Card Validation Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
