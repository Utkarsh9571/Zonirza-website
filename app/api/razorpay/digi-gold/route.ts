import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { razorpay } from '@/lib/razorpay';
import DigitalGoldWallet from '@/models/DigitalGoldWallet';
import DigitalGoldTransaction from '@/models/DigitalGoldTransaction';
import GoldRateSnapshot from '@/models/GoldRateSnapshot';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount } = body;

    if (!amount || amount < 100) {
      return NextResponse.json({ success: false, error: 'Minimum amount is ₹100' }, { status: 400 });
    }

    const userId = (session.user as any).id;
    await dbConnect();

    // Fetch active gold rate
    const rate = await GoldRateSnapshot.findOne({ active: true }).sort({ createdAt: -1 });
    if (!rate) {
      return NextResponse.json({ success: false, error: 'No active gold rate available' }, { status: 400 });
    }

    // Get or create wallet
    let wallet = await DigitalGoldWallet.findOne({ userId });
    if (!wallet) {
      wallet = await DigitalGoldWallet.create({ userId, totalGrams: 0, totalInvestment: 0, currentEstimatedValue: 0 });
    }

    // Calculate exact grams based on the rate (including GST if applicable, though usually rate includes it or we do it separately)
    // For simplicity, we assume rate.buyRate24K is the price per gram (e.g. 7000). Total cost includes GST.
    // actual price per gram = rate.buyRate24K + (rate.buyRate24K * rate.gst / 100)
    const effectiveRate = rate.buyRate24K * (1 + rate.gst / 100);
    const calculatedGrams = Number((amount / effectiveRate).toFixed(4));

    // Create pending transaction
    const transaction = await DigitalGoldTransaction.create({
      walletId: wallet._id,
      userId,
      type: 'buy',
      rupeeAmount: amount,
      goldGrams: calculatedGrams,
      goldRateAtExecution: rate.buyRate24K,
      status: 'pending',
    });

    // Initialize Razorpay order
    const options = {
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `digigold_${transaction._id}`,
      notes: {
        transactionId: transaction._id.toString(),
        type: 'digigold_buy'
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);
    transaction.razorpayOrderId = razorpayOrder.id;
    await transaction.save();

    return NextResponse.json({
      success: true,
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      transactionId: transaction._id
    });
  } catch (error: any) {
    console.error('DigiGold Razorpay Initialization Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
