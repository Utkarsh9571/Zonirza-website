import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { cleanupPendingOrders } from '@/lib/orderCleanup';

export async function GET(req: NextRequest) {
  return handleCron();
}

export async function POST(req: NextRequest) {
  return handleCron();
}

async function handleCron() {
  try {
    await dbConnect();
    await cleanupPendingOrders();
    return NextResponse.json({ success: true, message: 'Cron order cleanup completed.' });
  } catch (error: any) {
    console.error('[CRON ORDER CLEANUP] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
