import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import DigitalGoldWallet from '@/models/DigitalGoldWallet';
import DigitalGoldTransaction from '@/models/DigitalGoldTransaction';
import { getLiveGoldRate } from '@/lib/goldRates';
import { calculatePortfolioValuation, calculateTransactionPerformance } from '@/lib/digiGoldValuation';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    await dbConnect();
    
    let wallet = await DigitalGoldWallet.findOne({ userId });
    if (!wallet) {
      wallet = await DigitalGoldWallet.create({
        userId,
        totalGrams: 0,
        totalInvestment: 0,
        currentEstimatedValue: 0
      });
    }

    const liveRate = await getLiveGoldRate();
    const currentSellRate = liveRate?.sellRate24K || 0;

    const valuation = calculatePortfolioValuation(
      wallet.totalGrams,
      wallet.totalInvestment,
      currentSellRate
    );

    // Update wallet estimated value while we're here
    if (wallet.currentEstimatedValue !== valuation.currentValue) {
      wallet.currentEstimatedValue = valuation.currentValue;
      await wallet.save();
    }

    const rawTransactions = await DigitalGoldTransaction.find({ walletId: wallet._id })
      .sort({ createdAt: -1 })
      .limit(50);
      
    const transactions = rawTransactions.map((tx: any) => {
      const perf = calculateTransactionPerformance(tx.rupeeAmount, tx.goldGrams, currentSellRate);
      return {
        ...tx.toObject(),
        performance: tx.type === 'buy' ? perf : null,
      };
    });

    return NextResponse.json({ 
      success: true, 
      wallet, 
      valuation,
      transactions,
      liveRate
    });
  } catch (error: any) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
