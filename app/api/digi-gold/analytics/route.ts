import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import DigitalGoldWallet from '@/models/DigitalGoldWallet';
import DigitalGoldTransaction from '@/models/DigitalGoldTransaction';
import { getHistoricalGoldRates, getLiveGoldRate } from '@/lib/goldRates';
import { generatePortfolioInsights, checkAndAwardMilestones } from '@/lib/digiGoldInsights';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    await dbConnect();

    const wallet = await DigitalGoldWallet.findOne({ userId });
    if (!wallet || wallet.totalInvestment === 0) {
      return NextResponse.json({ success: true, data: [] }); // Empty chart data
    }

    // Get historical rates (last 30 days)
    const historicalRates = await getHistoricalGoldRates(30);
    
    // Get all successful transactions for the user
    const transactions = await DigitalGoldTransaction.find({
      walletId: wallet._id,
      status: 'success'
    }).sort({ createdAt: 1 });

    // Generate chart data points
    // Recharts expects an array like: [{ date: 'Jan 1', value: 1000, invested: 800 }]
    const chartData = [];
    let accumulatedGrams = 0;
    let accumulatedInvestment = 0;

    // Fast-forward transaction pointers to match historical rates dates
    // If the user started investing recently, days before the first tx will just have 0
    let txIndex = 0;

    for (let i = 0; i < historicalRates.length; i++) {
      const rateObj = historicalRates[i];
      const rateDate = new Date(rateObj.timestamp);
      rateDate.setHours(23, 59, 59, 999); // End of that day

      // Add any transactions that happened up to this date
      while (txIndex < transactions.length && new Date(transactions[txIndex].createdAt) <= rateDate) {
        const tx = transactions[txIndex];
        if (tx.type === 'buy') {
          accumulatedGrams += tx.goldGrams;
          accumulatedInvestment += tx.rupeeAmount;
        } else if (tx.type === 'sell' || tx.type === 'redeem') {
          accumulatedGrams -= tx.goldGrams;
          accumulatedInvestment -= tx.rupeeAmount; // Simplified: actually should remove proportional investment
        }
        txIndex++;
      }

      const dayValue = accumulatedGrams * rateObj.sellRate24K;

      chartData.push({
        date: rateObj.timestamp.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        timestamp: rateObj.timestamp,
        invested: Number(accumulatedInvestment.toFixed(2)),
        value: Number(dayValue.toFixed(2)),
        rate: rateObj.sellRate24K
      });
    }

    // Phase 5 Intelligence
    const liveRate = await getLiveGoldRate();
    const currentRate = liveRate ? liveRate.sellRate24K : 7000;
    const valuation = {
      currentValue: wallet.totalGrams * currentRate,
      percentageGrowth: wallet.totalInvestment > 0 ? (((wallet.totalGrams * currentRate) - wallet.totalInvestment) / wallet.totalInvestment) * 100 : 0
    };

    const insights = await generatePortfolioInsights(wallet, transactions, valuation);
    const newMilestones = await checkAndAwardMilestones(userId, wallet, valuation);

    return NextResponse.json({ success: true, data: chartData, insights, newMilestones });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
