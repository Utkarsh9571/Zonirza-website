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
  product: { category: string; categoryConfig?: any; categoryOverrides?: any; }
): number {
  if (!size) return baseWeight;

  const overrides = product.categoryOverrides?.weightRules || {};
  const config = product.categoryConfig?.weightRules || {};

  const sizeIncrementWeight = overrides.sizeIncrementWeight ?? config.sizeIncrementWeight;
  const lengthIncrementWeight = overrides.lengthIncrementWeight ?? config.lengthIncrementWeight;

  const sizeStr = size.trim().toLowerCase();

  if (sizeIncrementWeight !== undefined) {
    const baseSize = overrides.baseSize ?? config.baseSize ?? 12;
    const sizeNum = parseFloat(sizeStr.replace(/[^\d.]/g, ''));
    if (isNaN(sizeNum)) return baseWeight;
    
    let diff = sizeNum - baseSize;
    // Special handling for Bangle step sizes which increment by 0.2
    if ((product.category || '').toLowerCase().includes('bangle')) {
      diff = diff / 0.2; 
    }
    
    return Math.max(0.1, baseWeight + (diff * sizeIncrementWeight));
  }

  if (lengthIncrementWeight !== undefined) {
    const baseLength = overrides.baseLength ?? config.baseLength ?? 20;
    let offset = 0;
    
    // Handle S/M/L/XL text sizes for bracelets
    if (['s', 'small'].includes(sizeStr)) offset = -1;
    else if (['m', 'medium'].includes(sizeStr)) offset = 0;
    else if (['l', 'large'].includes(sizeStr)) offset = 1;
    else if (['xl', 'extra large'].includes(sizeStr)) offset = 2;
    else {
      const sizeNum = parseFloat(sizeStr.replace(/[^\d.]/g, ''));
      if (!isNaN(sizeNum)) {
        offset = sizeNum - baseLength;
      }
    }
    
    return Math.max(0.1, baseWeight + (offset * lengthIncrementWeight));
  }

  return baseWeight;
}

/**
 * Calculate the metal price based on weight and purity
 */
function calculateMetalPrice(weight: number, metal: string, purity: string, rates: any, product: { categoryConfig?: any; categoryOverrides?: any; }): number {
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
  const baseMultiplier = multipliers[purity] || multipliers['18K'] || 0.750;
  
  let metalPrice = weight * rate * baseMultiplier;

  // Apply Purity Adjustment from Config/Overrides
  const pOverrides = product.categoryOverrides?.pricingRules?.goldPurityAdjustments || {};
  const pConfig = product.categoryConfig?.pricingRules?.goldPurityAdjustments || {};
  const adjustmentPercentage = pOverrides[purity] ?? pConfig[purity];

  if (adjustmentPercentage) {
    metalPrice = metalPrice * (1 + (adjustmentPercentage / 100));
  }

  return metalPrice;
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
    categoryConfig?: any;
    categoryOverrides?: any;
  },
  config: ProductConfiguration,
  providedRates?: any
): PricingBreakdown {
  const overrides = product.pricingOverrides || {};
  const rates = providedRates || {};
  
  // Calculate dynamic gold weight using category specific rules
  const baseWeightVal = product.baseWeight || product.price || 5.0;
  const estimatedGoldWeight = calculateEstimatedWeight(baseWeightVal, config.size, product);
  
  // Metal pricing
  const metalPrice = calculateMetalPrice(estimatedGoldWeight, config.metal, config.purity, rates, product);
  
  // Stone pricing (weight-driven or spec-driven)
  let stonePrice = 0;
  let estimatedStoneWeightGrams = 0;
  
  const specsObj = product.specs instanceof Map ? Object.fromEntries(product.specs) : (product.specs || {});
  const jType = (product.jewelryType || '').toLowerCase();
  
  if (jType === 'diamond') {
    const grade = config.stone || 'Diamond-Standard';
    const stoneOverriddenPrice = overrides.stonePrices instanceof Map 
      ? overrides.stonePrices.get(grade) 
      : overrides.stonePrices?.[grade];
      
    if (stoneOverriddenPrice !== undefined && stoneOverriddenPrice !== null) {
      stonePrice = stoneOverriddenPrice;
    } else {
      const dWeight = parseFloat(specsObj.diamondWeight || specsObj.stoneWeight || '0') || 0;
      const ratePerCarat = DIAMOND_RATES[grade] || DIAMOND_RATES['Diamond-Standard'];
      stonePrice = dWeight * ratePerCarat;
    }

    // Apply Diamond Quality Adjustment
    const dOverrides = product.categoryOverrides?.pricingRules?.diamondQualityAdjustments || {};
    const dConfig = product.categoryConfig?.pricingRules?.diamondQualityAdjustments || {};
    const adjustmentPercentage = dOverrides[grade] ?? dConfig[grade];
    if (adjustmentPercentage) {
      stonePrice = stonePrice * (1 + (adjustmentPercentage / 100));
    }
    
    let activeWeight = parseFloat(specsObj.diamondWeight || specsObj.stoneWeight || '0') || 0;
    const weightMatch = grade.match(/([\d.-]+)\s*ct/i);
    if (weightMatch) {
      activeWeight = parseFloat(weightMatch[1].replace('-', '.')) || activeWeight;
    }
    estimatedStoneWeightGrams = activeWeight * 0.2; // 1 carat = 0.2g
  } else if (jType === 'stone') {
    const sType = (product.stoneType || specsObj.stoneType || specsObj.stoneName || 'default').toLowerCase();
    const stoneOverriddenPrice = overrides.stonePrices instanceof Map 
      ? overrides.stonePrices.get(config.stone) 
      : overrides.stonePrices?.[config.stone || ''];
      
    if (stoneOverriddenPrice !== undefined && stoneOverriddenPrice !== null) {
      stonePrice = stoneOverriddenPrice;
    } else {
      const sWeight = parseFloat(specsObj.stoneWeight || specsObj.diamondWeight || '0') || 0;
      const ratePerCarat = GEMSTONE_RATES[sType] || GEMSTONE_RATES['default'];
      stonePrice = sWeight * ratePerCarat;
    }

    // Apply Stone Quality Adjustment
    const sOverrides = product.categoryOverrides?.pricingRules?.stoneQualityAdjustments || {};
    const sConfig = product.categoryConfig?.pricingRules?.stoneQualityAdjustments || {};
    const stoneGrade = config.stone || '';
    const adjustmentPercentage = sOverrides[stoneGrade] ?? sConfig[stoneGrade];
    if (adjustmentPercentage) {
      stonePrice = stonePrice * (1 + (adjustmentPercentage / 100));
    }
    
    let activeWeight = parseFloat(specsObj.stoneWeight || specsObj.diamondWeight || '0') || 0;
    const weightMatch = (config.stone || '').match(/([\d.-]+)\s*ct/i);
    if (weightMatch) {
      activeWeight = parseFloat(weightMatch[1].replace('-', '.')) || activeWeight;
    }
    estimatedStoneWeightGrams = activeWeight * 0.2;
  }

  // Making charges: Check Category Overrides, then Category Config, then Product Fallback
  let makingCharges = 0;
  const mcOverride = product.categoryOverrides?.makingCharges;
  const mcConfig = product.categoryConfig?.makingCharges;
  const mcEffective = mcOverride ?? mcConfig;

  if (mcEffective) {
    if (mcEffective.type === 'percentage') {
      makingCharges = metalPrice * (mcEffective.value / 100);
    } else if (mcEffective.type === 'fixed') {
      makingCharges = mcEffective.value;
    }
  } else {
    // Legacy fallback
    makingCharges = overrides.makingCharges !== undefined 
      ? overrides.makingCharges 
      : (product.makingCharges || (metalPrice * 0.15));
  }
  
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
