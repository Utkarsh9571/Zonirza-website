import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import GoldRateSnapshot from '@/models/GoldRateSnapshot';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const rates = await GoldRateSnapshot.find().sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ success: true, data: rates });
  } catch (error: any) {
    console.error('Error fetching admin rates:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { buyRate24K, sellRate24K, spread, gst, active } = body;

    await dbConnect();

    // If this new one is active, deactivate others
    if (active) {
      await GoldRateSnapshot.updateMany({ active: true }, { $set: { active: false } });
    }

    const rate = await GoldRateSnapshot.create({
      buyRate24K,
      sellRate24K,
      spread: spread || 0,
      gst: gst || 3,
      active,
      createdBy: (session.user as any)?.id,
    });

    return NextResponse.json({ success: true, data: rate });
  } catch (error: any) {
    console.error('Error creating admin rate:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
