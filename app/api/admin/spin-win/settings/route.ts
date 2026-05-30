import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized administrative access' }, { status: 401 });
    }

    await dbConnect();
    const settings = await Settings.findOne();
    const enabled = settings ? settings.spinWinEnabled !== false : true;

    return NextResponse.json({ success: true, enabled });
  } catch (error: any) {
    console.error('[ADMIN WHEEL SETTINGS GET API] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized administrative access' }, { status: 401 });
    }

    const body = await req.json();
    const { enabled } = body;

    if (typeof enabled !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Missing enabled status' }, { status: 400 });
    }

    await dbConnect();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    settings.spinWinEnabled = enabled;
    await settings.save();

    return NextResponse.json({ success: true, enabled: settings.spinWinEnabled });
  } catch (error: any) {
    console.error('[ADMIN WHEEL SETTINGS POST API] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
