import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import GiftCardTransaction from '@/models/GiftCardTransaction';
import GiftCard from '@/models/GiftCard';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized administrative access' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const giftCardId = searchParams.get('giftCardId');

    const filter: any = {};
    if (giftCardId) {
      filter.giftCardId = giftCardId;
    }

    // Retrieve transactions, populating details from the related GiftCard document
    const transactions = await GiftCardTransaction.find(filter)
      .populate({
        path: 'giftCardId',
        model: GiftCard,
        select: 'code recipientName recipientEmail currency status',
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: transactions });
  } catch (error: any) {
    console.error('Admin Transactions Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
