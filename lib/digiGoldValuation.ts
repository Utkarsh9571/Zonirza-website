export interface ValuationMetrics {
  currentValue: number;
  averageAcquisitionCost: number;
  totalInvested: number;
  unrealizedGainLoss: number;
  percentageGrowth: number;
}

/**
 * Ensures safe decimal rounding for finance calculations
 */
export const formatFinance = (value: number, decimals: number = 2): number => {
  return Number(value.toFixed(decimals));
};

/**
 * Calculates the portfolio valuation for a digital gold wallet.
 * 
 * @param totalGrams Total grams held in the wallet
 * @param totalInvested Total INR invested by the user
 * @param liveSellRate The current 24K sell rate (per gram)
 * @returns ValuationMetrics object
 */
export const calculatePortfolioValuation = (
  totalGrams: number,
  totalInvested: number,
  liveSellRate: number
): ValuationMetrics => {
  if (totalGrams <= 0) {
    return {
      currentValue: 0,
      averageAcquisitionCost: 0,
      totalInvested: 0,
      unrealizedGainLoss: 0,
      percentageGrowth: 0,
    };
  }

  // Current value is based on the SELL rate (what the user would get if they sold or redeemed today)
  const currentValue = formatFinance(totalGrams * liveSellRate, 2);
  
  // Average buy price per gram
  const averageAcquisitionCost = formatFinance(totalInvested / totalGrams, 2);
  
  // Gain / Loss (INR)
  const unrealizedGainLoss = formatFinance(currentValue - totalInvested, 2);
  
  // Percentage Growth
  let percentageGrowth = 0;
  if (totalInvested > 0) {
    percentageGrowth = formatFinance((unrealizedGainLoss / totalInvested) * 100, 2);
  }

  return {
    currentValue,
    averageAcquisitionCost,
    totalInvested: formatFinance(totalInvested, 2),
    unrealizedGainLoss,
    percentageGrowth,
  };
};

/**
 * Summarizes the performance of an individual transaction
 */
export const calculateTransactionPerformance = (
  rupeeAmount: number,
  goldGrams: number,
  liveSellRate: number
) => {
  const currentValue = formatFinance(goldGrams * liveSellRate, 2);
  const gainLoss = formatFinance(currentValue - rupeeAmount, 2);
  const growth = rupeeAmount > 0 ? formatFinance((gainLoss / rupeeAmount) * 100, 2) : 0;

  return {
    currentValue,
    gainLoss,
    growth
  };
};
