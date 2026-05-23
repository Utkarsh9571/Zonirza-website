import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import PlanEnrollment from '@/models/PlanEnrollment';
import PlanNominee from '@/models/PlanNominee';
import PlanTransaction from '@/models/PlanTransaction';
import PlanConfig from '@/models/PlanConfig';
import User from '@/models/User';
import { calculateGoldReserve } from '@/lib/monthlyPlan';
import { razorpay } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planType, monthlyAmount, personalDetails, nomineeDetails, paymentMethod } = body;

    if (!planType || !monthlyAmount || !personalDetails || !nomineeDetails) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    
    // Auto-create or fetch user based on personal details
    const userEmail = personalDetails.email?.toLowerCase();
    let user = await User.findOne({ email: userEmail });
    
    if (!user) {
      user = await User.create({
        email: userEmail,
        name: personalDetails.fullName,
        phone: personalDetails.mobile,
        onboardingCompleted: false,
        lastLogin: new Date(),
      });
    }

    const userId = user._id.toString();

    // 1. Fetch Plan Config to ensure it's active and get global settings
    const config = await PlanConfig.findOne({ planType, isActive: true });
    
    // Fallback defaults if config doesn't exist yet in DB for testing
    const durationMonths = config?.durationMonths || 10;
    const bonusMultiplier = config?.bonusMultiplier || 1.0;
    const currentGoldRatePerGram = config?.currentGoldRatePerGram || 6800; 

    // 2. Generate Pricing Snapshot based on Plan Type
    let pricingSnapshot: any = {
      monthlyAmount,
      durationMonths,
      bonusMultiplier,
      bonusAmount: monthlyAmount * bonusMultiplier,
      maturityAmount: (monthlyAmount * durationMonths) + (monthlyAmount * bonusMultiplier),
    };

    let accumulatedGoldGrams = 0;

    if (planType === 'gold_reserve') {
      const reserveDetails = calculateGoldReserve(monthlyAmount, currentGoldRatePerGram, durationMonths, bonusMultiplier);
      pricingSnapshot = {
        ...pricingSnapshot,
        goldRatePerGramAtEnrollment: currentGoldRatePerGram,
        projectedGoldAccumulation: reserveDetails.projectedTotalGold,
        maturityAmount: reserveDetails.projectedMaturityValue
      };
      accumulatedGoldGrams = reserveDetails.reservedGoldGramsPerInstallment;
    }

    // 3. Create Enrollment Document
    const nextPaymentDate = new Date();
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + durationMonths);

    const enrollment = await PlanEnrollment.create({
      userId,
      planType,
      status: 'pending',
      pricingSnapshot,
      installmentsPaid: 0,
      totalAmountPaid: 0,
      accumulatedGoldGrams: 0,
      enrollmentDate: new Date(),
      nextPaymentDate,
      maturityDate
    });

    // 4. Create Nominee Document
    await PlanNominee.create({
      enrollmentId: enrollment._id,
      userId,
      fullName: nomineeDetails.fullName,
      relationship: nomineeDetails.relationship,
      nationality: nomineeDetails.nationality
    });

    // 5. Create Transaction Document for the first installment
    const transaction = await PlanTransaction.create({
      enrollmentId: enrollment._id,
      userId,
      installmentNumber: 1,
      amount: monthlyAmount,
      status: 'pending',
      paymentMethod: paymentMethod || 'card',
      dueDate: new Date(),
      goldRateApplied: planType === 'gold_reserve' ? currentGoldRatePerGram : undefined,
      goldUnitsAdded: accumulatedGoldGrams > 0 ? accumulatedGoldGrams : undefined
    });

    // 6. Generate Razorpay Order
    const options = {
      amount: Math.round(monthlyAmount * 100), // paise
      currency: 'INR',
      receipt: transaction._id.toString()
    };
    const razorpayOrder = await razorpay.orders.create(options);

    transaction.gatewayReference = razorpayOrder.id;
    await transaction.save();

    // Optionally: Update User document with personal details if not already complete

    return NextResponse.json({
      success: true,
      enrollmentId: enrollment._id,
      transactionId: transaction._id,
      razorpayOrderId: razorpayOrder.id,
      amount: options.amount,
      message: 'Enrollment initiated'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Enrollment error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
