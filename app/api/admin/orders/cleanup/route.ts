import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { cleanupPendingOrders } from '@/lib/orderCleanup';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 });
    }

    await dbConnect();
    await cleanupPendingOrders();

    return NextResponse.json({ success: true, message: 'Admin-triggered order cleanup completed.' });
  } catch (error: any) {
    console.error('[ADMIN ORDER CLEANUP] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
