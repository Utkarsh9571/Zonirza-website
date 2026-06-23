import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SellGoldInquiry from '@/models/SellGoldInquiry';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const query: Record<string, string> = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const inquiries = await SellGoldInquiry.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: inquiries });
  } catch (error: any) {
    console.error('Fetch Sell Gold Inquiries Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
