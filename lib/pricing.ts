/**
 * Pricing Engine for Luxury Jewelry
 * Handles dynamic calculations for weight and price based on configurations
 */

export interface ProductConfiguration {
  metal: string;
  purity: string;
  size?: string;
  stone?: string;
  customization?: string[];
}

export interface PricingBreakdown {
  metalPrice: number;
  makingCharges: number;
  stonePrice: number;
  totalPrice: number;
  estimatedWeight: number;
}

// Mock constants - In a real app, these could come from an API or DB
const GOLD_RATE_24K = 6500; // Price per gram
const PLATINUM_RATE = 4000;
const SILVER_RATE = 100;

const PURITY_MULTIPLIERS: Record<string, number> = {
  '24K': 1.0,
  '22K': 0.916,
  '18K': 0.750,
  '14K': 0.585,
  '9K': 0.375,
};

const STONE_PRICES: Record<string, number> = {
  'VVS1': 50000,
  'VVS2': 40000,
  'VS1': 30000,
  'VS2': 25000,
  'SI1': 20000,
  'Diamond-Standard': 15000,
  'None': 0,
};

const SIZE_WEIGHT_OFFSET = 0.15; // Grams per size unit away from base size (e.g., size 7)
const BASE_SIZE = 7;

/**
 * Calculate the estimated weight based on ring size and metal density
 */
export function calculateEstimatedWeight(baseWeight: number, size: string | undefined): number {
  if (!size) return baseWeight;
  
  const sizeNum = parseFloat(size.replace(/[^\d.]/g, ''));
  if (isNaN(sizeNum)) return baseWeight;
  
  const diff = sizeNum - BASE_SIZE;
  return Math.max(0.1, baseWeight + (diff * SIZE_WEIGHT_OFFSET));
}

/**
 * Calculate the metal price based on weight and purity
 */
function calculateMetalPrice(weight: number, metal: string, purity: string): number {
  let rate = GOLD_RATE_24K;
  
  if (metal.toLowerCase().includes('platinum')) {
    rate = PLATINUM_RATE;
    return weight * rate;
  }
  
  if (metal.toLowerCase().includes('silver')) {
    rate = SILVER_RATE;
    return weight * rate;
  }
  
  const multiplier = PURITY_MULTIPLIERS[purity] || PURITY_MULTIPLIERS['18K'];
  return weight * rate * multiplier;
}

/**
 * Main Pricing Engine Function
 */
export function calculatePricing(
  product: { basePrice: number; baseWeight: number; makingCharges: number },
  config: ProductConfiguration
): PricingBreakdown {
  const estimatedWeight = calculateEstimatedWeight(product.baseWeight, config.size);
  
  const metalPrice = calculateMetalPrice(estimatedWeight, config.metal, config.purity);
  const makingCharges = product.makingCharges || (metalPrice * 0.15); // Default 15% if not set
  const stonePrice = STONE_PRICES[config.stone || 'None'] || 0;
  
  const totalPrice = metalPrice + makingCharges + stonePrice;
  
  return {
    metalPrice: Math.round(metalPrice),
    makingCharges: Math.round(makingCharges),
    stonePrice: Math.round(stonePrice),
    totalPrice: Math.round(totalPrice),
    estimatedWeight: parseFloat(estimatedWeight.toFixed(2)),
  };
}

/**
 * Format currency for display (Legacy - Please use displayPrice from '@/lib/currency' for multi-currency support)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
