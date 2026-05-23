import DigitalGoldMilestone from '@/models/DigitalGoldMilestone';

export async function generatePortfolioInsights(wallet: any, transactions: any[], valuation: any) {
  const insights: string[] = [];

  // Insight 1: Recent Accumulation
  const recentDays = 30;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - recentDays);

  const recentTransactions = transactions.filter(tx => new Date(tx.createdAt) > thirtyDaysAgo && tx.type === 'buy');
  const recentGrams = recentTransactions.reduce((acc, tx) => acc + tx.goldGrams, 0);

  if (recentGrams > 0) {
    insights.push(`You accumulated ${recentGrams.toFixed(2)}g of gold in the last 30 days.`);
  }

  // Insight 2: Growth Observation
  if (valuation.percentageGrowth > 5) {
    insights.push(`Your portfolio has grown by ${valuation.percentageGrowth.toFixed(1)}% since inception.`);
  }

  // Insight 3: Accumulation Velocity (Average monthly)
  if (transactions.length > 0) {
    const firstTxDate = new Date(transactions[transactions.length - 1].createdAt);
    const monthsSinceStart = Math.max(1, (new Date().getTime() - firstTxDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const avgMonthlyGrams = wallet.totalGrams / monthsSinceStart;

    if (monthsSinceStart > 1 && avgMonthlyGrams > 0.5) {
      insights.push(`You are accumulating an average of ${avgMonthlyGrams.toFixed(2)}g per month.`);
    }
  }

  return insights;
}

export async function checkAndAwardMilestones(userId: string, wallet: any, valuation: any) {
  const newMilestones: string[] = [];
  
  const existingMilestones = await DigitalGoldMilestone.find({ userId });
  const achievedTypes = new Set(existingMilestones.map(m => m.type));

  const check = async (type: string, condition: boolean) => {
    if (condition && !achievedTypes.has(type)) {
      await DigitalGoldMilestone.create({ userId, type });
      newMilestones.push(type);
    }
  };

  await check('first_investment', wallet.totalInvestment > 0);
  await check('first_gram', wallet.totalGrams >= 1);
  await check('10g_accumulated', wallet.totalGrams >= 10);
  await check('1L_portfolio', valuation.currentValue >= 100000);

  return newMilestones;
}
