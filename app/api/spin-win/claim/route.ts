import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import SpinAttempt from '@/models/SpinAttempt';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Authentication is required to claim rewards' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { attemptId } = body;

    if (!attemptId) {
      return NextResponse.json({ success: false, error: 'Missing spin attempt ID' }, { status: 400 });
    }

    const attempt = await SpinAttempt.findById(attemptId);
    if (!attempt) {
      return NextResponse.json({ success: false, error: 'Spin attempt record not found' }, { status: 404 });
    }

    if (attempt.claimed) {
      return NextResponse.json({ success: false, error: 'This reward has already been claimed' }, { status: 400 });
    }

    // Link attempt to logged-in user
    attempt.userId = userId;
    attempt.claimed = true;
    attempt.claimedAt = new Date();
    await attempt.save();

    return NextResponse.json({
      success: true,
      message: 'Reward claimed successfully and added to your profile.',
      couponCode: attempt.couponCode,
    });
  } catch (error: any) {
    console.error('[SPIN WIN CLAIM API] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
