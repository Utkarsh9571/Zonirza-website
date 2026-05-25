// lib/exchangeCalculator.ts

// These rates should ideally be fetched from a database (e.g. GoldRateSnapshot)
// but for now, we'll use a configurable baseline for estimation.
const BASE_GOLD_RATE_24K = 7500; // Example rate per gram in INR

export const PURITY_MULTIPLIERS: Record<string, number> = {
  '24K': 1.0,
  '22K': 0.916,
  '18K': 0.75,
  '14K': 0.585,
  '9K': 0.375,
};

/**
 * Calculate the estimated exchange value based on weight and purity.
 * @param weightInGrams - The weight of the gold in grams.
 * @param purity - The purity of the gold (e.g., '22K').
 * @param liveRate24K - The current live rate for 24K gold per gram.
 * @returns The estimated value in INR, or null if inputs are invalid.
 */
export function calculateEstimatedExchangeValue(
  weightInGrams: number,
  purity: string,
  liveRate24K: number = BASE_GOLD_RATE_24K
): number | null {
  if (!weightInGrams || weightInGrams <= 0) return null;
  
  const multiplier = PURITY_MULTIPLIERS[purity];
  if (!multiplier) return null;

  const estimatedValue = weightInGrams * liveRate24K * multiplier;
  
  return estimatedValue;
}

/**
 * Format the estimated value to INR currency string.
 * @param value - The estimated value.
 * @returns The formatted string.
 */
export function formatCurrencyINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}
