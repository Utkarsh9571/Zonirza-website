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

const DIAMOND_RATES: Record<string, number> = {
  'EF-VVS': 85000,
  'GH-VS': 65000,
  'GHI-VS': 55000,
  'FG-SI': 45000,
  'IJ-SI': 35000,
  'Diamond-Standard': 40000,
  'None': 0,
};

const GEMSTONE_RATES: Record<string, number> = {
  'ruby': 15000,
  'emerald': 18000,
  'sapphire': 20000,
  'topaz': 4000,
  'opal': 5000,
  'amethyst': 3000,
  'moissanite': 8000,
  'cz': 1000,
  'zirconia': 1000,
  'default': 5000,
};

/**
 * Calculate the estimated gold weight based on size and category
 */
export function calculateEstimatedWeight(
  baseWeight: number,
  size: string | undefined,
  category: string,
  providedRates?: any
): number {
  if (!size) return baseWeight;

  const rates = providedRates || {};
  const cat = (category || '').toLowerCase();
  const sizeStr = size.trim().toLowerCase();

  // Load offsets from rates or fallbacks
  const ringsOffset = rates.ringsOffset !== undefined ? rates.ringsOffset : 0.12;
  const chainsOffset = rates.chainsOffset !== undefined ? rates.chainsOffset : 0.25;
  const braceletsOffset = rates.braceletsOffset !== undefined ? rates.braceletsOffset : 0.15;
  const banglesOffset = rates.banglesOffset !== undefined ? rates.banglesOffset : 0.15;

  if (cat.includes('ring')) {
    const sizeNum = parseFloat(sizeStr.replace(/[^\d.]/g, ''));
    if (isNaN(sizeNum)) return baseWeight;
    const diff = sizeNum - 12; // Base size for rings is 12
    return Math.max(0.1, baseWeight + (diff * ringsOffset));
  }

  if (cat.includes('chain') || cat.includes('necklace') || cat.includes('mangalsutra')) {
    const sizeNum = parseFloat(sizeStr.replace(/[^\d.]/g, ''));
    if (isNaN(sizeNum)) return baseWeight;
    const diff = sizeNum - 20; // Base size for chains/necklaces is 20 inches
    return Math.max(0.1, baseWeight + (diff * chainsOffset));
  }

  if (cat.includes('bracelet') || cat.includes('anklet')) {
    let offset = 0;
    if (['s', 'small'].includes(sizeStr)) offset = -1;
    else if (['m', 'medium'].includes(sizeStr)) offset = 0;
    else if (['l', 'large'].includes(sizeStr)) offset = 1;
    else if (['xl', 'extra large'].includes(sizeStr)) offset = 2;
    else {
      const sizeNum = parseFloat(sizeStr.replace(/[^\d.]/g, ''));
      if (!isNaN(sizeNum)) {
        // If numeric, treat 7 inches as default M size
        offset = (sizeNum - 7);
      }
    }
    return Math.max(0.1, baseWeight + (offset * braceletsOffset));
  }

  if (cat.includes('bangle')) {
    const sizeNum = parseFloat(sizeStr.replace(/[^\d.]/g, ''));
    if (isNaN(sizeNum)) return baseWeight;
    // Step sizes are typically 2.2, 2.4, 2.6, 2.8. Default is 2.4
    const diff = (sizeNum - 2.4) / 0.2;
    return Math.max(0.1, baseWeight + (diff * banglesOffset));
  }

  return baseWeight;
}

/**
 * Calculate the metal price based on weight and purity
 */
function calculateMetalPrice(weight: number, metal: string, purity: string, rates: any): number {
  const metalRates = rates?.metalRates || rates || { gold24k: 6500, silver: 100, platinum: 4000 };
  let rate = metalRates.gold24k || rates.goldRate24K || 6500;
  
  if (metal.toLowerCase().includes('platinum')) {
    rate = metalRates.platinum || rates.platinumRate || 4000;
    return weight * rate;
  }
  
  if (metal.toLowerCase().includes('silver')) {
    rate = metalRates.silver || rates.silverRate || 100;
    return weight * rate;
  }
  
  const multipliers = rates?.purityMultipliers || PURITY_MULTIPLIERS;
  const multiplier = multipliers[purity] || multipliers['18K'] || 0.750;
  return weight * rate * multiplier;
}

/**
 * Main Pricing Engine Function - Client Side Friendly
 */
export function calculatePricing(
  product: { 
    basePrice?: number; 
    price?: number;
    baseWeight: number; 
    makingCharges: number; 
    category: string;
    jewelryType?: string;
    stoneType?: string;
    specs?: any;
    pricingOverrides?: any;
  },
  config: ProductConfiguration,
  providedRates?: any
): PricingBreakdown {
  const overrides = product.pricingOverrides || {};
  const rates = providedRates || {};
  
  // Calculate dynamic gold weight using category specific rules
  const baseWeightVal = product.baseWeight || product.price || 5.0;
  const estimatedGoldWeight = calculateEstimatedWeight(baseWeightVal, config.size, product.category, rates);
  
  // Metal pricing
  const metalPrice = calculateMetalPrice(estimatedGoldWeight, config.metal, config.purity, rates);
  
  // Stone pricing (weight-driven or spec-driven)
  let stonePrice = 0;
  let estimatedStoneWeightGrams = 0;
  
  const specsObj = product.specs instanceof Map ? Object.fromEntries(product.specs) : (product.specs || {});
  const jType = (product.jewelryType || '').toLowerCase();
  
  if (jType === 'diamond') {
    const dWeight = parseFloat(specsObj.diamondWeight || specsObj.stoneWeight || '0') || 0;
    const grade = config.stone || 'Diamond-Standard';
    const ratePerCarat = DIAMOND_RATES[grade] || DIAMOND_RATES['Diamond-Standard'];
    stonePrice = dWeight * ratePerCarat;
    estimatedStoneWeightGrams = dWeight * 0.2; // 1 carat = 0.2g
  } else if (jType === 'stone') {
    const sWeight = parseFloat(specsObj.stoneWeight || specsObj.diamondWeight || '0') || 0;
    const sType = (product.stoneType || specsObj.stoneType || specsObj.stoneName || 'default').toLowerCase();
    const ratePerCarat = GEMSTONE_RATES[sType] || GEMSTONE_RATES['default'];
    stonePrice = sWeight * ratePerCarat;
    estimatedStoneWeightGrams = sWeight * 0.2; // 1 carat = 0.2g
  }

  // Making charges: Use product override, then product default, then fallback to 15% of gold value
  const makingCharges = overrides.makingCharges !== undefined 
    ? overrides.makingCharges 
    : (product.makingCharges || (metalPrice * 0.15));
  
  const subTotal = metalPrice + makingCharges + stonePrice;
  const gstRate = (rates.gstPercentage !== undefined ? rates.gstPercentage : 3) / 100;
  const gst = subTotal * gstRate;
  const totalPrice = subTotal + gst;
  
  const estimatedTotalWeight = estimatedGoldWeight + estimatedStoneWeightGrams;
  
  return {
    metalPrice: Math.round(metalPrice),
    makingCharges: Math.round(makingCharges),
    stonePrice: Math.round(stonePrice),
    subTotal: Math.round(subTotal),
    gst: Math.round(gst),
    totalPrice: Math.round(totalPrice),
    estimatedWeight: parseFloat(estimatedTotalWeight.toFixed(2)),
    estimatedGoldWeight: parseFloat(estimatedGoldWeight.toFixed(2)),
    estimatedStoneWeight: parseFloat(estimatedStoneWeightGrams.toFixed(2)),
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
