import { ProductConfiguration, calculatePricing } from './pricing';
import ConfigurationRule from '@/models/ConfigurationRule';

interface QuoteEstimationInput {
  product: any;
  configuration: ProductConfiguration;
  customizationNotes: string;
  inspirationImages: string[];
  rates: Record<string, number>; // Currency rates, though we can base it on default currency (INR)
}

interface QuoteEstimationResult {
  complexity: 'Low Complexity' | 'Medium Complexity' | 'High Complexity' | 'Extreme Bespoke';
  estimation: {
    estimatedPriceMin: number;
    estimatedPriceMax: number;
    estimatedGoldWeight: number;
    estimatedSurcharges: number;
  };
  productionInsights: string[];
}

export async function generateQuoteEstimation(input: QuoteEstimationInput): Promise<QuoteEstimationResult> {
  const { product, configuration, customizationNotes, inspirationImages, rates } = input;
  
  const insights: string[] = [];
  let score = 0;
  let surcharges = 0;

  // 1. Calculate Base Pricing (without surcharges)
  const basePricing = calculatePricing({
    basePrice: product.basePrice || 0,
    baseWeight: product.baseWeight || 5.0,
    makingCharges: product.makingCharges || 0,
    category: product.category || '',
    jewelryType: product.jewelryType,
    stoneType: product.stoneType,
    specs: product.specs,
    pricingOverrides: product.pricingOverrides || {},
    categoryConfig: product.categoryConfig,
    categoryOverrides: product.categoryOverrides
  }, configuration, rates);

  // 2. Fetch Rules to calculate Surcharges & Triggers
  const rules = await ConfigurationRule.find({ isActive: true });
  for (const rule of rules) {
    let inScope = true;
    if (rule.scope?.categories?.length > 0 && !rule.scope.categories.includes(product.category)) inScope = false;
    if (rule.scope?.productIds?.length > 0 && !rule.scope.productIds.includes(product._id.toString())) inScope = false;

    if (!inScope) continue;

    let isTriggered = true;
    const hasMetals = rule.trigger.metals?.length > 0;
    const hasPurities = rule.trigger.purities?.length > 0;
    const hasStones = rule.trigger.stones?.length > 0;
    const hasSizes = rule.trigger.sizes?.length > 0;

    if (!hasMetals && !hasPurities && !hasStones && !hasSizes) {
      isTriggered = true;
    } else {
      if (hasMetals && !rule.trigger.metals.includes(configuration.metal)) isTriggered = false;
      if (hasPurities && !rule.trigger.purities.includes(configuration.purity)) isTriggered = false;
      if (hasStones && configuration.stone && !rule.trigger.stones.includes(configuration.stone)) isTriggered = false;
      if (hasSizes && configuration.size && !rule.trigger.sizes.includes(configuration.size)) isTriggered = false;
    }

    if (isTriggered) {
      if (rule.type === 'surcharge') {
        if (rule.result.surchargeType === 'percentage') {
          surcharges += (product.basePrice || 0) * (rule.result.surcharge! / 100);
        } else {
          surcharges += rule.result.surcharge!;
        }
        insights.push(`Applied rule surcharge: ${rule.name}`);
        score += 1; // Surcharges add slight complexity
      } else if (rule.type === 'consultation') {
        insights.push(`Rule triggered consultation: ${rule.name}`);
        score += 2;
      }
    }
  }

  // 3. Complexity Scoring Logic
  if (configuration.stone?.toLowerCase().includes('oversized') || configuration.stone?.toLowerCase().includes('large')) {
    score += 2;
    insights.push('Oversized stones may increase structural complexity and require specialized setting techniques.');
  }

  if (configuration.metal.toLowerCase().includes('platinum')) {
    score += 1;
    insights.push('Platinum requires specific high-temperature casting and specialized tools.');
  }

  if (inspirationImages.length > 0) {
    score += 3;
    insights.push(`Customer provided ${inspirationImages.length} inspiration images requiring bespoke CAD translation.`);
  }

  if (customizationNotes.length > 20) {
    score += 1;
    if (customizationNotes.toLowerCase().includes('engrave')) {
      score += 1;
      insights.push('Custom engraving requested.');
    }
    if (customizationNotes.toLowerCase().includes('thick') || customizationNotes.toLowerCase().includes('heavy')) {
      insights.push('Customer requested structural modifications which will affect final gold weight.');
    }
  }

  // Assign Complexity Level
  let complexity: QuoteEstimationResult['complexity'] = 'Low Complexity';
  if (score >= 6) complexity = 'Extreme Bespoke';
  else if (score >= 4) complexity = 'High Complexity';
  else if (score >= 2) complexity = 'Medium Complexity';

  // 4. Generate Guidance Ranges
  const baseTotal = basePricing.totalPrice + surcharges;
  
  // Bespoke Variance Buffer
  let varianceMin = 0;
  let varianceMax = 0;

  switch (complexity) {
    case 'Low Complexity':
      varianceMin = -0.02; // -2%
      varianceMax = 0.05;  // +5%
      break;
    case 'Medium Complexity':
      varianceMin = -0.05; // -5%
      varianceMax = 0.10;  // +10%
      break;
    case 'High Complexity':
      varianceMin = -0.05; // -5%
      varianceMax = 0.20;  // +20%
      break;
    case 'Extreme Bespoke':
      varianceMin = 0.0;   // 0%
      varianceMax = 0.35;  // +35%
      break;
  }

  const estimatedPriceMin = Math.round(baseTotal * (1 + varianceMin));
  const estimatedPriceMax = Math.round(baseTotal * (1 + varianceMax));

  return {
    complexity,
    estimation: {
      estimatedPriceMin,
      estimatedPriceMax,
      estimatedGoldWeight: basePricing.estimatedGoldWeight || 0,
      estimatedSurcharges: surcharges
    },
    productionInsights: insights
  };
}
