import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import DigitalGoldSIP from '@/models/DigitalGoldSIP';
import DigitalGoldSIPInstallment from '@/models/DigitalGoldSIPInstallment';
import { z } from 'zod';

const SIPSchema = z.object({
  monthlyAmount: z.number().min(100),
  goalName: z.string().optional(),
  targetAmount: z.number().optional()
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const userId = (session.user as any).id;

    const sips = await DigitalGoldSIP.find({ userId }).sort({ createdAt: -1 });
    
    // Fetch upcoming installments for all active SIPs
    const activeSipIds = sips.filter(s => s.status === 'active').map(s => s._id);
    const upcomingInstallments = await DigitalGoldSIPInstallment.find({
      sipId: { $in: activeSipIds },
      status: { $in: ['upcoming', 'overdue'] }
    }).sort({ dueDate: 1 });

    return NextResponse.json({ success: true, sips, upcomingInstallments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validation = SIPSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid SIP data', details: validation.error.format() }, { status: 400 });
    }

    await dbConnect();
    const userId = (session.user as any).id;

    // Create the SIP
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const sip = await DigitalGoldSIP.create({
      userId,
      monthlyAmount: validation.data.monthlyAmount,
      goalName: validation.data.goalName,
      targetAmount: validation.data.targetAmount,
      startDate: new Date(),
      nextDueDate: nextMonth,
      status: 'active'
    });

    // Generate the FIRST installment (due immediately)
    const firstInstallment = await DigitalGoldSIPInstallment.create({
      sipId: sip._id,
      userId,
      amount: validation.data.monthlyAmount,
      dueDate: new Date(),
      status: 'upcoming'
    });

    return NextResponse.json({ success: true, sip, firstInstallment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
