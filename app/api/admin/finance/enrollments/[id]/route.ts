import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import PlanEnrollment from '@/models/PlanEnrollment';
import PlanNominee from '@/models/PlanNominee';
import PlanTransaction from '@/models/PlanTransaction';
import User from '@/models/User';

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { id } = await props.params;
    await connectDB();

    const enrollment = await PlanEnrollment.findById(id).lean();
    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    const user = await User.findById(enrollment.userId).select('name email phone addresses').lean();
    const nominee = await PlanNominee.findOne({ enrollmentId: id }).lean();
    const transactions = await PlanTransaction.find({ enrollmentId: id }).sort({ installmentNumber: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: {
        ...enrollment,
        user,
        nominee,
        transactions
      }
    });

  } catch (error: any) {
    console.error('Error fetching enrollment details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { id } = await props.params;
    const { status } = await req.json();

    if (!status || !['active', 'pending', 'suspended', 'cancelled', 'matured', 'redeemed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await connectDB();
    
    const enrollment = await PlanEnrollment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully',
      data: enrollment
    });

  } catch (error: any) {
    console.error('Error updating enrollment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
