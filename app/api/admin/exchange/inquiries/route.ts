import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import ExchangeInquiry from '@/models/ExchangeInquiry';

export async function GET(req: Request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const query = (status && status !== 'all') ? { status } : {};

    const inquiries = await ExchangeInquiry.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: inquiries }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch Exchange Inquiries Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}
