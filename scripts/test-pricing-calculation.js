
const ProductRaw = {
  basePrice: 22720,
  price: undefined,
  baseWeight: undefined,
  makingCharges: 250,
  category: "rings",
  jewelryType: undefined,
  stoneType: undefined,
  specs: {
    "Gold Weight": "3.04g",
    "Diamond Weight": ".06ct",
  },
  pricingOverrides: { makingCharges: null, sizeWeightOffset: null, stonePrices: {} },
  configurableOptions: {
    stones: ['VVS1', 'VS1', 'SI1', 'Diamond-Standard'],
    sizes: ['5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'],
    purities: ['9K','14K','18K'],
    metals: ['white-gold','yellow-gold','rose-gold']
  },
  defaultMetal: "yellow-gold",
  defaultPurity: undefined,
  defaultDiamondQuality: undefined
};

// Copy-paste of the calculatePricing functions just for testing
const PURITY_MULTIPLIERS = {
  '24K': 1.0,
  '22K': 0.916,
  '18K': 0.750,
  '14K': 0.585,
  '9K': 0.375,
};

const DIAMOND_RATES = {
  'EF-VVS': 85000,
  'GH-VS': 65000,
  'GHI-VS': 55000,
  'FG-SI': 45000,
  'IJ-SI': 35000,
  'Diamond-Standard': 40000,
  'None': 0,
};

function calculateEstimatedWeight(baseWeight, size, product) {
  return baseWeight;
}
function calculateMetalPrice(weight, metal, purity, rates, product) {
  const metalRates = rates?.metalRates ?? { gold24k: 6500, silver: 100, platinum: 4000 };
  let rate = metalRates.gold24k ?? 6500;
  
  if (metal.toLowerCase().includes('platinum')) {
    rate = metalRates.platinum ?? 4000;
    return weight * rate;
  }
  
  if (metal.toLowerCase().includes('silver')) {
    rate = metalRates.silver ?? 100;
    return weight * rate;
  }
  
  const multipliers = rates?.purityMultipliers ?? PURITY_MULTIPLIERS;
  const baseMultiplier = multipliers[purity] ?? 0.750;
  
  let metalPrice = weight * rate * baseMultiplier;
  return metalPrice;
}

function calculatePricingTest(product, config, providedRates) {
  const overrides = product.pricingOverrides || {};
  const rates = providedRates || {};
  
  // Calculate dynamic gold weight using category specific rules
  const baseWeightVal = product.baseWeight || product.price || 5.0;
  console.log("baseWeightVal:", baseWeightVal);
  const estimatedGoldWeight = baseWeightVal;
  console.log("estimatedGoldWeight:", estimatedGoldWeight);
  
  // Metal pricing
  const metalPrice = calculateMetalPrice(estimatedGoldWeight, config.metal, config.purity, rates, product);
  console.log("metalPrice:", metalPrice);
  
  let stonePrice = 0;
  let stoneWeightCarats = 0;
  const specsObj = product.specs || {};
  const jType = (product.jewelryType || '').toLowerCase();
  console.log("jType:", jType);
  const isDiamond = jType === 'diamond';
  console.log("isDiamond:", isDiamond);
  
  if (isDiamond) {
    const grade = config.stone || 'Diamond-Standard';
    const dWeight = parseFloat(specsObj["Diamond Weight"] || specsObj.stoneWeight || '0') || 0;
    console.log("dWeight (Diamond Weight):", dWeight);
    const ratePerCarat = DIAMOND_RATES[grade] || 40000;
    stonePrice = dWeight * ratePerCarat;
    console.log("stonePrice:", stonePrice);
    stoneWeightCarats = dWeight;
  }

  let makingCharges = 0;
  if (overrides.makingCharges !== undefined && overrides.makingCharges !== null && overrides.makingCharges !== '') {
    makingCharges = Number(overrides.makingCharges);
  } else if (product.makingCharges !== undefined && product.makingCharges !== null && product.makingCharges !==0) {
    makingCharges = Number(product.makingCharges);
  } else {
    makingCharges = metalPrice * 0.15;
  }
  console.log("makingCharges:", makingCharges);
  
  const subTotal = metalPrice + makingCharges + stonePrice;
  const gst = subTotal * 0.03;
  const totalPrice = subTotal + gst;
  
  console.log("\nFINAL:");
  console.log({subTotal, gst, totalPrice});
  return {metalPrice, stonePrice, makingCharges, totalPrice};
}

console.log("\n========== PRODUCT CARD CONFIG:");
const cardConfig = { metal: "yellow-gold", purity: "18K", size: "12", stone: "EF-VVS" }; // Wait what does mapLegacyStones return for VVS1?
calculatePricingTest(ProductRaw, cardConfig);

console.log("\n========== PDP CONFIG:");
const pdpConfig = { metal: "yellow-gold", purity: "18K", size: "12", stone: "EF-VVS" }; 
calculatePricingTest(ProductRaw, pdpConfig);

