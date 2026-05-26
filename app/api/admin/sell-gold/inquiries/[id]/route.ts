import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SellGoldInquiry from '@/models/SellGoldInquiry';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const { id } = await params;
    const inquiry = await SellGoldInquiry.findById(id);
    if (!inquiry) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: inquiry });
  } catch (error: any) {
    console.error('Fetch Sell Gold Inquiry Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const body = await req.json();
    const { id } = await params;
    const updatedInquiry = await SellGoldInquiry.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedInquiry) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedInquiry });
  } catch (error: any) {
    console.error('Update Sell Gold Inquiry Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
