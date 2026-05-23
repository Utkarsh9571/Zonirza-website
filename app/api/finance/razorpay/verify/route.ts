import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import PlanTransaction from '@/models/PlanTransaction';
import PlanEnrollment from '@/models/PlanEnrollment';
import { verifyRazorpaySignature } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      transactionId,
      enrollmentId
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !transactionId || !enrollmentId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 1. Verify Signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature. Verification failed.' }, { status: 400 });
    }

    // 2. Update Database Documents
    await dbConnect();
    const transaction = await PlanTransaction.findById(transactionId);
    
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (transaction.gatewayReference !== razorpay_order_id) {
       return NextResponse.json({ error: 'Razorpay Order ID mismatch' }, { status: 400 });
    }

    const enrollment = await PlanEnrollment.findById(enrollmentId);
    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    // Update Transaction
    transaction.status = 'success';
    transaction.paidAt = new Date();
    await transaction.save();

    // Update Enrollment
    enrollment.status = 'active';
    enrollment.installmentsPaid += 1;
    enrollment.totalAmountPaid += transaction.amount;
    if (transaction.goldUnitsAdded) {
      enrollment.accumulatedGoldGrams += transaction.goldUnitsAdded;
    }
    
    // We already set nextPaymentDate and maturityDate in the enroll route.
    await enrollment.save();

    return NextResponse.json({ success: true, message: 'Payment verified successfully' });
  } catch (error: any) {
    console.error('Razorpay Verification Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
