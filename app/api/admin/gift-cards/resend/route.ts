import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { sendGiftCardEmail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized administrative access' }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing gift card ID' }, { status: 400 });
    }

    await dbConnect();
    const GiftCard = (await import('@/models/GiftCard')).default;
    const User = (await import('@/models/User')).default;
    const GiftCardTransaction = (await import('@/models/GiftCardTransaction')).default;

    const giftCard = await GiftCard.findById(id);
    if (!giftCard) {
      return NextResponse.json({ success: false, error: 'Gift card not found' }, { status: 404 });
    }

    if (giftCard.status === 'cancelled') {
      return NextResponse.json({ success: false, error: 'Cannot send cancelled gift cards' }, { status: 400 });
    }

    // Determine sender name
    let senderName = 'A Generous Friend';
    if (giftCard.senderUserId) {
      const sender = await User.findById(giftCard.senderUserId);
      if (sender && sender.name) {
        senderName = sender.name;
      }
    } else if (giftCard.createdByAdmin) {
      senderName = 'Zoniraz Curator';
    }

    // Dispatch the email
    console.log(`[ADMIN RESEND] Resending gift card email for ${giftCard.code} to ${giftCard.recipientEmail}`);
    const mailResult = await sendGiftCardEmail(giftCard, senderName);

    if (!mailResult.success) {
      return NextResponse.json({ success: false, error: 'Failed to send email via SMTP transporter', details: mailResult.error }, { status: 500 });
    }

    // Update status
    giftCard.deliveryStatus = 'delivered';
    giftCard.deliveredAt = new Date();
    await giftCard.save();

    // Log resend transaction
    await GiftCardTransaction.create({
      giftCardId: giftCard._id,
      type: 'adjusted',
      amount: 0,
      balanceBefore: giftCard.currentBalance,
      balanceAfter: giftCard.currentBalance,
      actorUserId: (session.user as any).id,
      metadata: { notes: `Voucher email manually resent to ${giftCard.recipientEmail} by Admin` },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully resent gift card voucher email to ${giftCard.recipientEmail}`
    });

  } catch (error: any) {
    console.error('[ADMIN RESEND] Error resending gift card email:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
