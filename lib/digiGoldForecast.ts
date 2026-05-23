import { getLiveGoldRate } from './goldRates';

const ESTIMATED_ANNUAL_GROWTH_RATE = 0.08; // 8% conservative estimate

export async function generateSIPForecast(monthlyAmount: number, months: number = 60) {
  const liveRate = await getLiveGoldRate();
  const currentSellRate = liveRate ? liveRate.sellRate24K : 7000; // Fallback for pure offline simulation
  
  let accumulatedGrams = 0;
  let totalInvested = 0;
  
  // Create yearly milestones
  const milestones = [];
  
  for (let i = 1; i <= months; i++) {
    // Simulate slight monthly price increase based on annual growth rate
    const simulatedMonthlyRate = currentSellRate * Math.pow(1 + ESTIMATED_ANNUAL_GROWTH_RATE, i / 12);
    
    // Add grams for this month's contribution
    accumulatedGrams += monthlyAmount / simulatedMonthlyRate;
    totalInvested += monthlyAmount;
    
    if (i % 12 === 0) {
      milestones.push({
        year: i / 12,
        totalInvested,
        accumulatedGrams,
        projectedValue: accumulatedGrams * simulatedMonthlyRate
      });
    }
  }

  const simulatedFinalRate = currentSellRate * Math.pow(1 + ESTIMATED_ANNUAL_GROWTH_RATE, months / 12);
  const finalProjectedValue = accumulatedGrams * simulatedFinalRate;

  return {
    totalInvested,
    projectedAccumulatedGrams: accumulatedGrams,
    projectedValue: finalProjectedValue,
    estimatedGrowthPercentage: ((finalProjectedValue - totalInvested) / totalInvested) * 100,
    milestones
  };
}

export function calculateGoalProgress(currentGrams: number, currentRate: number, targetAmount: number) {
  const currentValue = currentGrams * currentRate;
  const progressPercentage = targetAmount > 0 ? (currentValue / targetAmount) * 100 : 0;
  
  return {
    currentValue,
    progressPercentage: Math.min(100, progressPercentage),
    remainingAmount: Math.max(0, targetAmount - currentValue)
  };
}
