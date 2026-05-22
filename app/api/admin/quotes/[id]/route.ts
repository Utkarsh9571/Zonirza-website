import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import QuoteRequest from '@/models/QuoteRequest';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if ((session?.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await props.params;
    const quote = await QuoteRequest.findById(id)
      .populate('product')
      .populate('user', 'name email');

    if (!quote) {
      return NextResponse.json({ success: false, message: 'Quote not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: quote });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if ((session?.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await props.params;
    const updates = await req.json();

    const quote = await QuoteRequest.findByIdAndUpdate(id, updates, { new: true });

    if (!quote) {
      return NextResponse.json({ success: false, message: 'Quote not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: quote });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
