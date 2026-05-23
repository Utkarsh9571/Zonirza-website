import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import DigitalGoldSIPInstallment from '@/models/DigitalGoldSIPInstallment';
import DigitalGoldSIP from '@/models/DigitalGoldSIP';
import { razorpay } from '@/lib/razorpay';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { installmentId } = await req.json();

    await dbConnect();
    const userId = (session.user as any).id;

    // Verify SIP ownership
    const sip = await DigitalGoldSIP.findOne({ _id: id, userId });
    if (!sip) {
      return NextResponse.json({ error: 'SIP not found' }, { status: 404 });
    }

    // Verify Installment
    const installment = await DigitalGoldSIPInstallment.findOne({ 
      _id: installmentId, 
      sipId: id,
      userId,
      status: { $in: ['upcoming', 'overdue'] }
    });

    if (!installment) {
      return NextResponse.json({ error: 'Valid installment not found' }, { status: 404 });
    }

    // Create Razorpay Order
    const options = {
      amount: Math.round(installment.amount * 100),
      currency: 'INR',
      receipt: `sip_${installment._id.toString()}`,
      notes: {
        sipId: id,
        installmentId: installment._id.toString()
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save Razorpay Order ID to Installment
    installment.razorpayOrderId = razorpayOrder.id;
    await installment.save();

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: options.amount
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
