import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import GiftCard from '@/models/GiftCard';
import GiftCardTransaction from '@/models/GiftCardTransaction';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userEmail = session.user.email;

    await dbConnect();

    // Query cards sent by the user or received by the user's email address
    const orConditions: any[] = [{ senderUserId: userId }];
    if (userEmail) {
      orConditions.push({ recipientEmail: userEmail.toLowerCase() });
    }

    const giftCards = await GiftCard.find({ $or: orConditions }).sort({ createdAt: -1 });

    const giftCardIds = giftCards.map(card => card._id);

    // Fetch all transaction histories for these cards
    const transactions = await GiftCardTransaction.find({ giftCardId: { $in: giftCardIds } }).sort({ createdAt: -1 });

    // Format response
    const data = giftCards.map(card => {
      const cardTx = transactions.filter(tx => tx.giftCardId.toString() === card._id.toString());
      return {
        ...card.toObject(),
        transactions: cardTx
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('My Gift Cards Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
