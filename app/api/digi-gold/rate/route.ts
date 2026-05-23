import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GoldRateSnapshot from '@/models/GoldRateSnapshot';

export async function GET() {
  try {
    await dbConnect();
    const rate = await GoldRateSnapshot.findOne({ active: true }).sort({ createdAt: -1 });
    
    if (!rate) {
      return NextResponse.json({ success: false, error: 'No active rate found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rate });
  } catch (error: any) {
    console.error('Error fetching gold rate:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
