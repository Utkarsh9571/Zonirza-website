import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import PlanEnrollment from '@/models/PlanEnrollment';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    await connectDB();

    // Fetch all enrollments
    const enrollments = await PlanEnrollment.find().sort({ createdAt: -1 }).lean();

    // Populate user info manually since userId is string reference
    const userIds = enrollments.map(e => e.userId);
    const users = await User.find({ _id: { $in: userIds } }).select('name email phone').lean();
    
    const userMap = users.reduce((acc: any, user: any) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});

    let activeGoldMine = 0;
    let activeGoldReserve = 0;
    let totalCollected = 0;

    const populatedEnrollments = enrollments.map((enrollment: any) => {
      if (enrollment.status === 'active') {
        if (enrollment.planType === 'gold_mine') activeGoldMine++;
        if (enrollment.planType === 'gold_reserve') activeGoldReserve++;
      }
      totalCollected += enrollment.totalAmountPaid || 0;

      return {
        ...enrollment,
        user: userMap[enrollment.userId] || { name: 'Unknown User', email: 'N/A' }
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        activeGoldMine,
        activeGoldReserve,
        totalCollected
      },
      data: populatedEnrollments
    });

  } catch (error: any) {
    console.error('Error fetching admin enrollments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
