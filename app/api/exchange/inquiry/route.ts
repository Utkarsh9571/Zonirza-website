import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import ExchangeInquiry from '@/models/ExchangeInquiry';
import { sendExchangeInquiryCustomerEmail, sendExchangeInquiryAdminEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const body = await req.json();

    // Basic validation
    if (!body.fullName || !body.phone || !body.email || !body.city) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const newInquiry = await ExchangeInquiry.create(body);

    // Send emails (non-blocking)
    Promise.all([
      sendExchangeInquiryCustomerEmail(newInquiry).catch(console.error),
      sendExchangeInquiryAdminEmail(newInquiry).catch(console.error)
    ]);

    return NextResponse.json({ success: true, data: newInquiry }, { status: 201 });
  } catch (error: any) {
    console.error('Exchange Inquiry Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
