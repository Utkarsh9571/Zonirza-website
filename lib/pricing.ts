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
  isCustomColor?: boolean;
  customColorNotes?: string;
  inspirationImages?: string[];
}

export interface PricingBreakdown {
  metalPrice: number;
  makingCharges: number;
  stonePrice: number;
  subTotal: number;
  gst: number;
  totalPrice: number;
  estimatedWeight: number;
  estimatedGoldWeight?: number;
  estimatedStoneWeight?: number;
}

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
export function calculateEstimatedWeight(baseWeight: number, size: string | undefined, sizeWeightOffset: number = SIZE_WEIGHT_OFFSET): number {
  if (!size) return baseWeight;
  
  const sizeNum = parseFloat(size.replace(/[^\d.]/g, ''));
  if (isNaN(sizeNum)) return baseWeight;
  
  const diff = sizeNum - BASE_SIZE;
  return Math.max(0.1, baseWeight + (diff * sizeWeightOffset));
}

/**
 * Calculate the metal price based on weight and purity
 */
function calculateMetalPrice(weight: number, metal: string, purity: string, rates: any): number {
  const metalRates = rates?.metalRates || rates || { gold24k: 6500, silver: 100, platinum: 4000 };
  let rate = metalRates.gold24k || 6500;
  
  if (metal.toLowerCase().includes('platinum')) {
    rate = metalRates.platinum || 4000;
    return weight * rate;
  }
  
  if (metal.toLowerCase().includes('silver')) {
    rate = metalRates.silver || 100;
    return weight * rate;
  }
  
  const multipliers = rates?.purityMultipliers || PURITY_MULTIPLIERS;
  const multiplier = multipliers[purity] || multipliers['18K'] || 0.750;
  return weight * rate * multiplier;
}

/**
 * Main Pricing Engine Function - Client Side Friendly (Uses defaults or provided rates)
 */
export function calculatePricing(
  product: { basePrice: number; baseWeight: number; makingCharges: number; pricingOverrides?: any },
  config: ProductConfiguration,
  providedRates?: any
): PricingBreakdown {
  const overrides = product.pricingOverrides || {};
  const rates = providedRates || {};
  
  const sizeWeightOffset = overrides.sizeWeightOffset !== undefined ? overrides.sizeWeightOffset : rates.sizeWeightOffset;
  const estimatedGoldWeight = calculateEstimatedWeight(product.baseWeight, config.size, sizeWeightOffset);
  
  // Stone weights estimation (approximate calculation for display)
  let estimatedStoneWeight = 0;
  if (config.stone && config.stone !== 'None') {
     // Placeholder estimation: VVS1/VS1 are assumed as standard carats that convert to grams (1 ct = 0.2g)
     // A more robust system would map actual stone types to their carats.
     estimatedStoneWeight = 0.2; // 1 carat default
  }
  
  const estimatedTotalWeight = estimatedGoldWeight + estimatedStoneWeight;
  
  const metalPrice = calculateMetalPrice(estimatedGoldWeight, config.metal, config.purity, rates);
  
  // Making charges: Use product override, then product default, then fallback to 15%
  const makingCharges = overrides.makingCharges !== undefined 
    ? overrides.makingCharges 
    : (product.makingCharges || (metalPrice * 0.15));
  
  const stonePrices = overrides.stonePrices || rates.stonePrices || STONE_PRICES;
  const stonePrice = stonePrices[config.stone || 'None'] || 0;
  
  const subTotal = metalPrice + makingCharges + stonePrice;
  const gstRate = (rates.gstPercentage || 3) / 100;
  const gst = subTotal * gstRate;
  const totalPrice = subTotal + gst;
  
  return {
    metalPrice: Math.round(metalPrice),
    makingCharges: Math.round(makingCharges),
    stonePrice: Math.round(stonePrice),
    subTotal: Math.round(subTotal),
    gst: Math.round(gst),
    totalPrice: Math.round(totalPrice),
    estimatedWeight: parseFloat(estimatedTotalWeight.toFixed(2)),
    estimatedGoldWeight: parseFloat(estimatedGoldWeight.toFixed(2)),
    estimatedStoneWeight: parseFloat(estimatedStoneWeight.toFixed(2)),
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
