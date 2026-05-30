import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import WheelPrize from '@/models/WheelPrize';
import SpinAttempt from '@/models/SpinAttempt';

export async function POST(req: NextRequest) {
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
      return NextResponse.json({ success: false, error: 'Spin & Win is currently disabled' }, { status: 400 });
    }

    // 1. Enforce rate limit (1 spin every 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
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
    if (lastAttempt) {
      return NextResponse.json({ success: false, error: 'You can only spin once every 24 hours.' }, { status: 429 });
    }

    // 2. Fetch enabled prizes
    const prizes = await WheelPrize.find({ enabled: true }).sort({ displayOrder: 1 });
    if (prizes.length === 0) {
      return NextResponse.json({ success: false, error: 'No wheel prizes configured' }, { status: 500 });
    }

    // 3. Weighted selection algorithm
    const totalWeight = prizes.reduce((acc, prize) => acc + (prize.probabilityWeight || 0), 0);
    if (totalWeight <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid wheel configuration weights' }, { status: 500 });
    }

    const random = Math.random() * totalWeight;
    let accumulatedWeight = 0;
    let selectedPrize = prizes[0];
    let selectedIndex = 0;

    for (let i = 0; i < prizes.length; i++) {
      accumulatedWeight += prizes[i].probabilityWeight || 0;
      if (random <= accumulatedWeight) {
        selectedPrize = prizes[i];
        selectedIndex = i;
        break;
      }
    }

    // 4. Save attempt record
    const attempt = await SpinAttempt.create({
      userId: userId || undefined,
      ipAddress: ip,
      userAgent,
      wheelSlot: selectedIndex,
      couponCode: selectedPrize.couponCode || undefined,
      claimed: !!userId,
      claimedAt: userId ? new Date() : undefined,
    });

    return NextResponse.json({
      success: true,
      data: {
        attemptId: attempt._id,
        index: selectedIndex,
        title: selectedPrize.title,
        couponCode: selectedPrize.couponCode || null,
        claimed: attempt.claimed,
      }
    });
  } catch (error: any) {
    console.error('[SPIN WIN EXECUTE API] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
