import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import ExchangeInquiry from '@/models/ExchangeInquiry';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const { id } = await params;
    const inquiry = await ExchangeInquiry.findById(id);

    if (!inquiry) {
      return NextResponse.json({ success: false, error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: inquiry }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch Single Inquiry Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch inquiry' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const body = await req.json();
    const { status, adminNotes } = body;
    const { id } = await params;

    const updatedInquiry = await ExchangeInquiry.findByIdAndUpdate(
      id,
      { $set: { status, adminNotes } },
      { new: true }
    );

    if (!updatedInquiry) {
      return NextResponse.json({ success: false, error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedInquiry }, { status: 200 });
  } catch (error: any) {
    console.error('Update Inquiry Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update inquiry' },
      { status: 500 }
    );
  }
}
