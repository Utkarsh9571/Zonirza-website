import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import QuoteRequest from '@/models/QuoteRequest';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if ((session?.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const query: any = {};
    if (status && status !== 'All') {
      query.status = status;
    }

    const quotes = await QuoteRequest.find(query)
      .populate('product', 'name images slug')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: quotes });
  } catch (error: any) {
    console.error('Error fetching admin quotes:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
