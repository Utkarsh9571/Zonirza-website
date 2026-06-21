import { calculatePricing, ProductConfiguration } from '@/lib/pricing';
import { IProduct } from '@/models/Product';

export interface MonthlyPlanDetails {
  monthlyAmount: number;
  totalAccumulated: number;
  bonusAmount: number;
  effectiveSavingsPercent: number;
  totalPrice: number;
}

/**
 * Calculates the 10+1 Monthly Savings Plan based on the product's dynamic price.
 * It consumes the existing pricing engine to ensure a single source of truth.
 */
export function calculateMonthlyPlan(
  product: IProduct,
  config: ProductConfiguration,
  rates?: any
): MonthlyPlanDetails {
  const pricing = calculatePricing(
    {
      basePrice: product.basePrice || 0,
      baseWeight: product.baseWeight || 0,
      makingCharges: product.makingCharges || 0,
      category: product.category || '',
      jewelryType: product.jewelryType,
      stoneType: product.stoneType,
      specs: product.specs,
      pricingOverrides: product.pricingOverrides || {},
    },
    config,
    rates
  );

  const totalPrice = pricing.totalPrice;

  // Monthly installment is 1/10th of the total price, rounded up for simplicity.
  const monthlyAmount = Math.ceil(totalPrice / 10);

  // Bonus is a full installment (FULL_INSTALLMENT) for the 11th month.
  const bonusAmount = monthlyAmount; // Full installment benefit.

  const totalAccumulated = monthlyAmount * 11; // 10 months + bonus month.

  const effectiveSavingsPercent = Number(
    ((totalAccumulated - totalPrice) / totalPrice) * 100
  ).toFixed(2);

  return {
    monthlyAmount,
    totalAccumulated,
    bonusAmount,
    effectiveSavingsPercent: Number(effectiveSavingsPercent),
    totalPrice,
  };
}

export interface GoldReserveDetails {
  monthlyAmount: number;
  durationMonths: number;
  totalPayment: number;
  currentGoldRatePerGram: number;
  reservedGoldGramsPerInstallment: number;
  projectedTotalGold: number;
  bonusMultiplier: number;
  bonusAmount: number;
  projectedMaturityValue: number;
}

/**
 * Calculates the Gold Reserve Investment Plan.
 * It uses the provided or global gold rate to determine gold units accumulated.
 */
export function calculateGoldReserve(
  monthlyAmount: number,
  currentGoldRatePerGram: number,
  durationMonths: number = 10,
  bonusMultiplier: number = 1.0 // 1.0 means 100% of 1 month's installment
): GoldReserveDetails {
  const totalPayment = monthlyAmount * durationMonths;
  const reservedGoldGramsPerInstallment = monthlyAmount / currentGoldRatePerGram;
  const projectedTotalGold = reservedGoldGramsPerInstallment * durationMonths;
  
  const bonusAmount = monthlyAmount * bonusMultiplier;
  
  // Projected Maturity Value = (Total Gold * Rate) + Bonus
  // Assuming rate stays constant for the projection
  const projectedMaturityValue = (projectedTotalGold * currentGoldRatePerGram) + bonusAmount;

  return {
    monthlyAmount,
    durationMonths,
    totalPayment,
    currentGoldRatePerGram,
    reservedGoldGramsPerInstallment,
    projectedTotalGold,
    bonusMultiplier,
    bonusAmount,
    projectedMaturityValue,
  };
}
