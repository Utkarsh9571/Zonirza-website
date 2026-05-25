import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SellGoldInquiry from '@/models/SellGoldInquiry';
import { sendSellGoldInquiryCustomerEmail, sendSellGoldInquiryAdminEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const body = await req.json();

    // Basic validation
    if (!body.fullName || !body.phone || !body.city || !body.preferredContactMethod) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const newInquiry = await SellGoldInquiry.create(body);

    // Send emails (non-blocking)
    Promise.all([
      sendSellGoldInquiryCustomerEmail(newInquiry).catch(console.error),
      sendSellGoldInquiryAdminEmail(newInquiry).catch(console.error)
    ]);

    return NextResponse.json({ success: true, data: newInquiry }, { status: 201 });
  } catch (error: any) {
    console.error('Sell Gold Inquiry Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
