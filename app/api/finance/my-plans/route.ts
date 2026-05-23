import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import PlanEnrollment from '@/models/PlanEnrollment';
import PlanTransaction from '@/models/PlanTransaction';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    await connectDB();

    // Fetch all active and completed enrollments for this user
    const enrollments = await PlanEnrollment.find({ userId }).sort({ createdAt: -1 }).lean();

    // Attach transaction history to each enrollment
    const enrollmentsWithTransactions = await Promise.all(
      enrollments.map(async (enrollment) => {
        const transactions = await PlanTransaction.find({ enrollmentId: enrollment._id })
          .sort({ installmentNumber: -1 })
          .lean();
          
        return {
          ...enrollment,
          transactions
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: enrollmentsWithTransactions
    });

  } catch (error: any) {
    console.error('Error fetching my-plans:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
