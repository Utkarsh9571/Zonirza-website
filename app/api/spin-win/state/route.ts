import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import WheelPrize from '@/models/WheelPrize';
import SpinAttempt from '@/models/SpinAttempt';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as any).id : null;

    // Get IP Address
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : (req.headers.get('x-real-ip') || '127.0.0.1');
    const userAgent = req.headers.get('user-agent') || '';

    // Check Settings status
    const settings = await Settings.findOne();
    const isWheelEnabled = settings ? settings.spinWinEnabled !== false : true;

    if (!isWheelEnabled) {
      return NextResponse.json({
        success: true,
        spinWinEnabled: false,
        canSpin: false,
        prizes: [],
      });
    }

    // Fetch enabled prizes
    const prizes = await WheelPrize.find({ enabled: true }).sort({ displayOrder: 1 });

    // Exclude couponId and couponCode for security
    const sanitizedPrizes = prizes.map((prize, idx) => ({
      id: prize._id,
      index: idx,
      title: prize.title,
      displayOrder: prize.displayOrder,
    }));

    // Check rate limit (1 spin every 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Check by user account OR guest IP + UserAgent
    const query: any = {
      createdAt: { $gte: oneDayAgo }
    };
    if (userId) {
      query.$or = [
        { userId },
        { ipAddress: ip, userAgent }
      ];
    } else {
      query.ipAddress = ip;
      query.userAgent = userAgent;
    }

    const lastAttempt = await SpinAttempt.findOne(query).sort({ createdAt: -1 });

    let canSpin = true;
    let timeLeft = 0;

    if (lastAttempt) {
      canSpin = false;
      const msPassed = Date.now() - new Date(lastAttempt.createdAt).getTime();
      timeLeft = Math.max(0, Math.ceil((24 * 60 * 60 * 1000 - msPassed) / 1000));
    }

    return NextResponse.json({
      success: true,
      spinWinEnabled: true,
      canSpin,
      timeLeft,
      prizes: sanitizedPrizes,
    });
  } catch (error: any) {
    console.error('[SPIN WIN STATE API] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
