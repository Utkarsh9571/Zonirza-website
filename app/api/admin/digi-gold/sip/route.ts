import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DigitalGoldSIP from '@/models/DigitalGoldSIP';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const activeSips = await DigitalGoldSIP.find({ status: 'active' });
    
    const totalActiveSIPs = activeSips.length;
    const projectedMonthlyRevenue = activeSips.reduce((sum, sip) => sum + sip.monthlyAmount, 0);

    const sips = await DigitalGoldSIP.find().populate('userId', 'name email').sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      stats: {
        totalActiveSIPs,
        projectedMonthlyRevenue
      },
      sips 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
