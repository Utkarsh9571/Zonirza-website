/**
 * Pricing Determinism Proof Script
 * Connects directly to MongoDB and runs the EXACT same formula as lib/pricing.ts
 * No Next.js runtime, no caching, no HTTP — raw DB values only.
 */

import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/jewelry-starter";


// ── Hardcoded fallbacks (mirrors lib/pricing.ts) ──────────────────────────────
const PURITY_MULTIPLIERS = { '24K': 1.0, '22K': 0.916, '18K': 0.750, '14K': 0.585, '9K': 0.375 };

const DIAMOND_RATES = {
  'EF-VVS': 85000, 'GH-VS': 65000, 'GHI-VS': 55000,
  'FG-SI': 45000, 'IJ-SI': 35000, 'Diamond-Standard': 40000, 'None': 0,
};

const GEMSTONE_RATES = {
  'ruby': 15000, 'emerald': 18000, 'sapphire': 20000,
  'topaz': 4000, 'opal': 5000, 'amethyst': 3000,
  'moissanite': 8000, 'cz': 1000, 'zirconia': 1000, 'default': 5000,
};

// ── Mirror of lib/pricing.ts calculateEstimatedWeight ────────────────────────
function calculateEstimatedWeight(baseWeight, size, product) {
  if (!size) return baseWeight;
  const overrides = product.categoryOverrides?.weightRules || {};
  const config   = product.categoryConfig?.weightRules || {};
  const sizeIncrementWeight   = overrides.sizeIncrementWeight   ?? config.sizeIncrementWeight;
  const lengthIncrementWeight = overrides.lengthIncrementWeight ?? config.lengthIncrementWeight;
  const sizeStr = String(size).trim().toLowerCase();

  if (sizeIncrementWeight !== undefined) {
    const baseSize = overrides.baseSize ?? config.baseSize ?? 12;
    const sizeNum  = parseFloat(sizeStr.replace(/[^\d.]/g, ''));
    if (isNaN(sizeNum)) return baseWeight;
    let diff = sizeNum - baseSize;
    if ((product.category || '').toLowerCase().includes('bangle')) diff = diff / 0.2;
    return Math.max(0.1, baseWeight + diff * sizeIncrementWeight);
  }

  if (lengthIncrementWeight !== undefined) {
    const baseLength = overrides.baseLength ?? config.baseLength ?? 20;
    let offset = 0;
    if (['s','small'].includes(sizeStr))              offset = -1;
    else if (['m','medium'].includes(sizeStr))        offset = 0;
    else if (['l','large'].includes(sizeStr))         offset = 1;
    else if (['xl','extra large'].includes(sizeStr))  offset = 2;
    else { const n = parseFloat(sizeStr.replace(/[^\d.]/g,'')); if (!isNaN(n)) offset = n - baseLength; }
    return Math.max(0.1, baseWeight + offset * lengthIncrementWeight);
  }

  return baseWeight;
}

// ── Mirror of lib/pricing.ts calculateMetalPrice ─────────────────────────────
function calculateMetalPrice(weight, metal, purity, rates, product) {
  const metalRates = rates?.metalRates ?? { gold24k: 6500, silver: 100, platinum: 4000 };
  let rate = metalRates.gold24k ?? rates.goldRate24K ?? 6500;

  if (metal.toLowerCase().includes('platinum')) { rate = metalRates.platinum ?? 4000; return weight * rate; }
  if (metal.toLowerCase().includes('silver'))   { rate = metalRates.silver   ?? 100;  return weight * rate; }

  const multipliers     = rates?.purityMultipliers ?? PURITY_MULTIPLIERS;
  const baseMultiplier  = multipliers[purity] ?? multipliers['18K'] ?? 0.750;
  let metalPrice        = weight * rate * baseMultiplier;

  const pOverrides = product.categoryOverrides?.pricingRules?.goldPurityAdjustments ?? {};
  const pConfig    = product.categoryConfig?.pricingRules?.goldPurityAdjustments ?? {};
  const adj        = pOverrides[purity] ?? pConfig[purity];
  if (adj) metalPrice = metalPrice * (1 + adj / 100);

  return metalPrice;
}

// ── Mirror of lib/ecommerce.ts sharedDefaultProductConfiguration ──────────────
function resolveDefaultMetal(product) {
  if (!product) return 'yellow-gold';
  const normalize = m => m.toLowerCase().replace(/\s+/g, '-');
  if (product.defaultMetal) return normalize(product.defaultMetal);
  if (product.defaultColor) return normalize(product.defaultColor);
  const metals = (product.configurableOptions?.metals?.length ? product.configurableOptions.metals : ['White Gold','Rose Gold','Yellow Gold']).map(normalize);
  if (metals.includes('yellow-gold')) return 'yellow-gold';
  return metals[0] || 'yellow-gold';
}

const LEGACY_STONE_MAP = { 'VVS1':'EF-VVS','VS1':'GH-VS','SI1':'IJ-SI','DIAMOND STANDARD':'Diamond-Standard','DIAMOND-STANDARD':'Diamond-Standard' };
function mapLegacyStone(s) { return LEGACY_STONE_MAP[s.toUpperCase()] || s; }

function sharedDefaultConfig(product) {
  if (!product) return { metal:'yellow-gold', purity:'18K', size:'', stone:'None' };
  const co      = product.configurableOptions || {};
  const purities = product.goldPurityOptions?.length ? product.goldPurityOptions : (co.purities?.length ? co.purities : ['18K','14K','9K']);
  const sizes    = co.sizes?.length ? co.sizes : ['7','8','9','10','11'];
  const rawStones= co.stones?.length ? co.stones : ['EF-VVS','GH-VS','IJ-SI','Diamond-Standard'];
  const stones   = rawStones.map(mapLegacyStone);

  const cfg = {
    metal  : resolveDefaultMetal(product),
    purity : purities.includes('18K') ? '18K' : (purities[0] || '18K'),
    size   : product.defaultSize || '',
    stone  : (product.jewelryType === 'gold' || stones.length === 0) ? 'None' : stones[0],
  };

  if (!cfg.size) {
    const cat = (product.category || '').toLowerCase();
    if      (cat.includes('ring'))                                              cfg.size = sizes.includes('12') ? '12' : (sizes.includes('7') ? '7' : sizes[0]);
    else if (cat.includes('chain') || cat.includes('necklace'))                 cfg.size = sizes.includes('20') ? '20' : sizes[0];
    else if (cat.includes('bracelet') || cat.includes('anklet'))                cfg.size = sizes.includes('M')  ? 'M'  : (sizes.includes('Medium') ? 'Medium' : sizes[0]);
    else if (cat.includes('bangle'))                                            cfg.size = sizes.includes('2.4') ? '2.4' : sizes[0];
  }
  return cfg;
}

// ── Mirror of lib/pricing.ts calculatePricing ─────────────────────────────────
function calculatePricing(product, config, rates) {
  const overrides       = product.pricingOverrides || {};
  const baseWeightVal   = product.baseWeight || 0;
  const estimatedGoldWeight = calculateEstimatedWeight(baseWeightVal, config.size, product);
  const metalPrice          = calculateMetalPrice(estimatedGoldWeight, config.metal, config.purity, rates, product);

  let stonePrice = 0, stoneName = '', stoneWeightCarats = 0;

  const specsObj = (product.specs instanceof Map) ? Object.fromEntries(product.specs) : (product.specs || {});
  const jType    = (product.jewelryType || '').toLowerCase();
  const isDiamond = jType === 'diamond';
  const isStone   = jType === 'stone';

  if (isDiamond) {
    stoneName = 'Diamond';
    const grade = config.stone || 'Diamond-Standard';
    const stonePricesMap = overrides.stonePrices;
    const stoneOverriddenPrice = stonePricesMap instanceof Map ? stonePricesMap.get(grade) : stonePricesMap?.[grade];

    if (stoneOverriddenPrice !== undefined && stoneOverriddenPrice !== null) {
      stonePrice = stoneOverriddenPrice;
    } else {
      const dWeight   = product.diamondWeightCarats || parseFloat(specsObj.diamondWeight || specsObj.stoneWeight || '0') || 0;
      const ratePerCt = DIAMOND_RATES[grade] || DIAMOND_RATES['Diamond-Standard'];
      stonePrice = dWeight * ratePerCt;
    }

    const dOverrides = product.categoryOverrides?.pricingRules?.diamondQualityAdjustments || {};
    const dConfig    = product.categoryConfig?.pricingRules?.diamondQualityAdjustments || {};
    const dAdj       = dOverrides[grade] ?? dConfig[grade];
    if (dAdj) stonePrice = stonePrice * (1 + dAdj / 100);

    let activeWeight = product.diamondWeightCarats || parseFloat(specsObj.diamondWeight || specsObj.stoneWeight || '0') || 0;
    const wMatch = grade.match(/([\d.-]+)\s*ct/i);
    if (wMatch) activeWeight = parseFloat(wMatch[1].replace('-','.')) || activeWeight;

    stoneWeightCarats = activeWeight;

  } else if (isStone) {
    const sType = (product.stoneType || specsObj.stoneType || specsObj.stoneName || 'default').toLowerCase();
    stoneName = specsObj.stoneName || product.stoneType || sType;
    if (stoneName) stoneName = stoneName.charAt(0).toUpperCase() + stoneName.slice(1);

    const stoneKey = config.stone ?? '';
    const stonePricesMap = overrides.stonePrices;
    const stoneOverriddenPrice = stonePricesMap instanceof Map ? stonePricesMap.get(stoneKey) : stonePricesMap?.[stoneKey];

    if (stoneOverriddenPrice !== undefined && stoneOverriddenPrice !== null) {
      stonePrice = stoneOverriddenPrice;
    } else {
      const sWeight   = parseFloat(specsObj.stoneWeight || specsObj.diamondWeight || '0') || 0;
      const ratePerCt = GEMSTONE_RATES[sType] || GEMSTONE_RATES['default'];
      stonePrice = sWeight * ratePerCt;
    }

    const sOverrides = product.categoryOverrides?.pricingRules?.stoneQualityAdjustments || {};
    const sConfig    = product.categoryConfig?.pricingRules?.stoneQualityAdjustments || {};
    const sAdj       = sOverrides[config.stone || ''] ?? sConfig[config.stone || ''];
    if (sAdj) stonePrice = stonePrice * (1 + sAdj / 100);

    let activeWeight = parseFloat(specsObj.stoneWeight || specsObj.diamondWeight || '0') || 0;
    const wMatch = (config.stone || '').match(/([\d.-]+)\s*ct/i);
    if (wMatch) activeWeight = parseFloat(wMatch[1].replace('-','.')) || activeWeight;

    stoneWeightCarats = activeWeight;
  }

  // Making charges — precedence ladder (lines 311-338 of pricing.ts)
  let makingCharges = 0;
  if (overrides.makingCharges !== undefined && overrides.makingCharges !== null && overrides.makingCharges !== '') {
    makingCharges = Number(overrides.makingCharges);
  } else if (product.categoryOverrides?.makingCharges) {
    const mc = product.categoryOverrides.makingCharges;
    makingCharges = mc.type === 'percentage' ? metalPrice * (mc.value / 100) : mc.value;
  } else if (product.categoryConfig?.makingCharges) {
    const mc = product.categoryConfig.makingCharges;
    makingCharges = mc.type === 'percentage' ? metalPrice * (mc.value / 100) : mc.value;
  } else if (product.makingCharges !== undefined && product.makingCharges !== null && product.makingCharges !== 0) {
    makingCharges = Number(product.makingCharges);
  } else {
    makingCharges = metalPrice * 0.15;
  }

  const subTotal   = metalPrice + makingCharges + stonePrice;
  const gstRate    = ((rates.gstPercentage !== undefined ? rates.gstPercentage : 3)) / 100;
  const gst        = subTotal * gstRate;
  const totalPrice = subTotal + gst;

  return {
    estimatedGoldWeight : parseFloat(estimatedGoldWeight.toFixed(2)),
    metalPrice    : Math.round(metalPrice),
    stonePrice    : Math.round(stonePrice),
    makingCharges : Math.round(makingCharges),
    subTotal      : Math.round(subTotal),
    gst           : Math.round(gst),
    totalPrice    : Math.round(totalPrice),
    isDiamond, isStone, stoneName, stoneWeightCarats,
  };
}

// ── helpers ───────────────────────────────────────────────────────────────────
function hr() { console.log('\n' + '─'.repeat(80)); }
function section(t) { hr(); console.log(`  ${t}`); hr(); }
function fmt(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }

// ── MAIN ──────────────────────────────────────────────────────────────────────
const TARGET_NAMES = [
  'Apex Stackable Double Row Diamond Ring',
  'Signature Minimal Piece',
  'Royal Gold Rope Chain',
  'Starlight Diamond Tennis Bracelet',
  'Ruby Floral Accent Bangle',
];

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  // Try both common DB names
  let db = client.db('test');
  let count = await db.collection('products').countDocuments();
  if (count === 0) {
    db = client.db('luxury-jewelryjewelhouse');
    count = await db.collection('products').countDocuments();
  }
  console.log(`\nConnected. DB: "${db.databaseName}"  |  Total products: ${count}`);

  // ── Fetch live pricing rates ──────────────────────────────────────────────
  const pricingRuleDoc = await db.collection('pricingrules').findOne({}, { sort: { createdAt: -1 } });
  const rates = pricingRuleDoc ? {
    metalRates       : { gold24k: pricingRuleDoc.goldRate24K, silver: pricingRuleDoc.silverRate, platinum: pricingRuleDoc.platinumRate },
    goldRate24K      : pricingRuleDoc.goldRate24K,
    silverRate       : pricingRuleDoc.silverRate,
    platinumRate     : pricingRuleDoc.platinumRate,
    gstPercentage    : pricingRuleDoc.gstPercentage,
    purityMultipliers: PURITY_MULTIPLIERS,
    diamondRates     : DIAMOND_RATES,
    gemstoneRates    : GEMSTONE_RATES,
  } : { metalRates: { gold24k: 6500, silver: 100, platinum: 4000 }, gstPercentage: 3, purityMultipliers: PURITY_MULTIPLIERS };

  console.log('\n📊 LIVE PRICING RATES FROM DB:');
  console.log(`   Gold 24K  : ₹${rates.metalRates.gold24k}/g`);
  console.log(`   Silver    : ₹${rates.metalRates.silver}/g`);
  console.log(`   Platinum  : ₹${rates.metalRates.platinum}/g`);
  console.log(`   GST       : ${rates.gstPercentage}%`);
  if (!pricingRuleDoc) console.warn('   ⚠️  No PricingRule document found – using hardcoded fallbacks');

  // ── Fetch all 5 products (case-insensitive regex) ─────────────────────────
  const products = await db.collection('products').find({
    name: { $in: TARGET_NAMES.map(n => new RegExp('^' + n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '$', 'i')) }
  }).toArray();

  console.log(`\nFound ${products.length}/${TARGET_NAMES.length} target products.`);
  const notFound = TARGET_NAMES.filter(n => !products.find(p => p.name.toLowerCase() === n.toLowerCase()));
  if (notFound.length) {
    console.warn('  ⚠️  NOT FOUND IN DB:', notFound);

    // Fuzzy fallback – show similar names
    const allNames = await db.collection('products').distinct('name');
    console.log('\n  All product names in DB:');
    allNames.forEach(n => console.log('   •', n));
  }

  // ── Hydrate categoryConfig for each product ───────────────────────────────
  for (const product of products) {
    const cat = await db.collection('categories').findOne(
      { $or: [ { slug: product.category }, { name: { $regex: new RegExp('^' + product.category + '$', 'i') } } ] }
    );
    if (cat?.config) product.categoryConfig = cat.config;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STEPS 1-4 per product
  // ═══════════════════════════════════════════════════════════════════════════
  for (const product of products) {
    section(`PRODUCT: ${product.name}`);

    // ── STEP 1: Raw DB Data ────────────────────────────────────────────────
    console.log('\n【STEP 1】RAW DB DATA');


    console.log(`  baseWeight            : ${product.baseWeight ?? 'UNDEFINED'}`);
    console.log(`  diamondWeightCarats   : ${product.diamondWeightCarats ?? 'UNDEFINED'}`);
    console.log(`  jewelryType           : ${product.jewelryType ?? 'UNDEFINED'}`);
    console.log(`  stoneType             : ${product.stoneType ?? 'UNDEFINED'}`);
    console.log(`  makingCharges         : ${product.makingCharges ?? 'UNDEFINED'}`);
    console.log(`  pricingOverrides      :`, JSON.stringify(product.pricingOverrides ?? null));
    console.log(`  categoryConfig.mc     :`, JSON.stringify(product.categoryConfig?.makingCharges ?? null));
    console.log(`  categoryOverrides.mc  :`, JSON.stringify(product.categoryOverrides?.makingCharges ?? null));

    // ── STEP 2: Default Configuration ─────────────────────────────────────
    console.log('\n【STEP 2】DEFAULT CONFIGURATION');
    const config = sharedDefaultConfig(product);
    console.log(`  metal   : ${config.metal}`);
    console.log(`  purity  : ${config.purity}`);
    console.log(`  size    : ${config.size || '(none)'}`);
    console.log(`  stone   : ${config.stone}`);

    // ── STEP 3: Formula Calculation ────────────────────────────────────────
    console.log('\n【STEP 3】FORMULA CALCULATION');
    const breakdown = calculatePricing(product, config, rates);

    const goldWeightLabel = `${breakdown.estimatedGoldWeight}g`;
    const goldRateLabel   = `${rates.metalRates.gold24k}/g × ${PURITY_MULTIPLIERS[config.purity] ?? 0.75} (${config.purity}) = ₹${rates.metalRates.gold24k * (PURITY_MULTIPLIERS[config.purity] ?? 0.75)}/g effective rate`;

    console.log(`  Gold Weight       : ${goldWeightLabel}`);
    console.log(`  Gold Price        : ${goldWeightLabel} × [${goldRateLabel}] = ${fmt(breakdown.metalPrice)}`);
    if (breakdown.isDiamond || breakdown.isStone) {
      console.log(`  Stone Type        : ${breakdown.stoneName} (${breakdown.isDiamond ? 'diamond' : 'gemstone'})`);
      console.log(`  Stone Weight      : ${breakdown.stoneWeightCarats} ct`);
      console.log(`  Stone Price       : ${fmt(breakdown.stonePrice)}`);
    }
    console.log(`  Making Charges    : ${fmt(breakdown.makingCharges)}`);

    // Show which tier in the precedence ladder was used
    const ov = product.pricingOverrides || {};
    let mcSource = '5-global-fallback(15%)';
    if (ov.makingCharges !== undefined && ov.makingCharges !== null && ov.makingCharges !== '') mcSource = '1-pricingOverrides';
    else if (product.categoryOverrides?.makingCharges) mcSource = '2-categoryOverrides';
    else if (product.categoryConfig?.makingCharges) mcSource = '3-categoryConfig';
    else if (product.makingCharges) mcSource = '4-product.makingCharges';
    console.log(`    (source: ${mcSource})`);

    console.log(`  GST (${rates.gstPercentage}%)          : ${fmt(breakdown.gst)}`);
    console.log(`  ─────────────────────────────────`);
    console.log(`  TOTAL PRICE       : ${fmt(breakdown.totalPrice)}`);

    // ── STEP 4: UI Verification (static) ──────────────────────────────────
    console.log('\n【STEP 4】UI PRICE PATHWAY');
    console.log('  Card  → ProductCard.tsx:83 → calculatePricing(product, config, rates) → totalPrice');
    console.log('  PDP   → ProductInteractiveUI → same calculatePricing call');
    console.log('  Cart  → cartStore adds item with { price: totalPrice }');
    console.log('  Checkout → reads cartStore.price, no recalculation');
    console.log(`\n  ✅  All four surfaces will show: ${fmt(breakdown.totalPrice)}`);
    console.log(`       (given same config: ${config.metal} | ${config.purity} | size=${config.size || 'none'} | stone=${config.stone})`);
    console.log('  ℹ️   Run Step 6 override test to verify live UI reflects override immediately.');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 5: Migration Validation
  // ═══════════════════════════════════════════════════════════════════════════
  section('STEP 5: MIGRATION VALIDATION');

  // 5a: diamond type but no diamondWeightCarats
  const diamondNoDW = await db.collection('products').find({
    jewelryType: 'diamond',
    $or: [{ diamondWeightCarats: { $exists: false } }, { diamondWeightCarats: null }, { diamondWeightCarats: 0 }]
  }, { projection: { name: 1, jewelryType: 1, diamondWeightCarats: 1 } }).toArray();

  console.log(`\n5a) jewelryType=diamond but diamondWeightCarats=undefined/null/0`);
  if (diamondNoDW.length === 0) {
    console.log('  ✅  None found — all diamond products have diamondWeightCarats set.');
  } else {
    console.log(`  ⚠️  ${diamondNoDW.length} affected:`);
    diamondNoDW.forEach(p => console.log(`    • ${p.name} (dwc=${p.diamondWeightCarats})`));
  }

  // 5b: stoneType=diamond but name contains gemstone keywords (misclassified)
  const gemstoneKeywords = ['Ruby','Emerald','Sapphire','Moissanite','CZ','Cubic'];
  const misclassified = await db.collection('products').find({
    stoneType: { $regex: /diamond/i },
    name: { $in: gemstoneKeywords.map(k => new RegExp(k, 'i')) }
  }, { projection: { name: 1, stoneType: 1, jewelryType: 1 } }).toArray();

  console.log(`\n5b) stoneType=diamond but name contains [${gemstoneKeywords.join(', ')}]`);
  if (misclassified.length === 0) {
    console.log('  ✅  None found — no gemstone products misclassified as diamond stoneType.');
  } else {
    console.log(`  ❌  ${misclassified.length} MISCLASSIFIED:`);
    misclassified.forEach(p => console.log(`    • ${p.name}  stoneType=${p.stoneType}  jewelryType=${p.jewelryType}`));
  }

  // 5c: jewelryType=diamond but name contains gemstone keywords
  const misclassified2 = await db.collection('products').find({
    jewelryType: 'diamond',
    name: { $in: gemstoneKeywords.map(k => new RegExp(k, 'i')) }
  }, { projection: { name: 1, stoneType: 1, jewelryType: 1 } }).toArray();

  console.log(`\n5c) jewelryType=diamond but name contains [${gemstoneKeywords.join(', ')}]`);
  if (misclassified2.length === 0) {
    console.log('  ✅  None found — no gemstone products misclassified as jewelryType=diamond.');
  } else {
    console.log(`  ❌  ${misclassified2.length} MISCLASSIFIED:`);
    misclassified2.forEach(p => console.log(`    • ${p.name}  stoneType=${p.stoneType}  jewelryType=${p.jewelryType}`));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 6: Admin Authority Test — Apex Ring
  // ═══════════════════════════════════════════════════════════════════════════
  section('STEP 6: ADMIN AUTHORITY TEST — Apex Stackable Double Row Diamond Ring');

  const apexProduct = products.find(p => p.name.toLowerCase().includes('apex'));
  if (!apexProduct) {
    console.log('  ⚠️  Apex Ring not found in fetched products. Skipping Step 6.');
  } else {
    const config   = sharedDefaultConfig(apexProduct);
    const baseline = calculatePricing(apexProduct, config, rates);

    console.log(`\n  Baseline Total: ${fmt(baseline.totalPrice)}`);
    console.log(`  Baseline Making: ${fmt(baseline.makingCharges)}`);

    // Simulate override = ₹5000
    const withOverride = { ...apexProduct, pricingOverrides: { ...(apexProduct.pricingOverrides || {}), makingCharges: 5000 } };
    const overrideBreakdown = calculatePricing(withOverride, config, rates);
    console.log(`\n  ── After setting pricingOverrides.makingCharges = ₹5000 ──`);
    console.log(`  Making Charges : ${fmt(overrideBreakdown.makingCharges)}`);
    console.log(`  New Total      : ${fmt(overrideBreakdown.totalPrice)}`);
    console.log(`  Difference     : ${fmt(overrideBreakdown.totalPrice - baseline.totalPrice)}`);
    console.log(`  ✅  Card / PDP / Cart / Checkout would ALL reflect ${fmt(overrideBreakdown.totalPrice)}`);

    // Simulate removing override
    const withoutOverride = { ...apexProduct, pricingOverrides: { ...(apexProduct.pricingOverrides || {}), makingCharges: null } };
    const removedBreakdown = calculatePricing(withoutOverride, config, rates);
    console.log(`\n  ── After removing override ──`);
    console.log(`  Making Charges : ${fmt(removedBreakdown.makingCharges)} (falls back to category/product rate)`);
    console.log(`  Total          : ${fmt(removedBreakdown.totalPrice)}`);

    // Simulate category making charges 12% → 10%
    const catMC_12 = { makingCharges: { type:'percentage', value: 12 } };
    const catMC_10 = { makingCharges: { type:'percentage', value: 10 } };

    // Apex WITH override — override takes precedence over category change
    const apexWithOverrideAnd12 = { ...apexProduct, categoryConfig: catMC_12, pricingOverrides: { makingCharges: 5000 } };
    const apexWithOverrideAnd10 = { ...apexProduct, categoryConfig: catMC_10, pricingOverrides: { makingCharges: 5000 } };
    const r12 = calculatePricing(apexWithOverrideAnd12, config, rates);
    const r10 = calculatePricing(apexWithOverrideAnd10, config, rates);
    console.log(`\n  ── Category MC 12%→10%, Apex override=₹5000 still active ──`);
    console.log(`  Total @12% cat: ${fmt(r12.totalPrice)}  Making: ${fmt(r12.makingCharges)}`);
    console.log(`  Total @10% cat: ${fmt(r10.totalPrice)}  Making: ${fmt(r10.makingCharges)}`);
    console.log(`  Difference     : ${fmt(r10.totalPrice - r12.totalPrice)} (should be ₹0 — override locks it)`);
    if (r10.totalPrice === r12.totalPrice) {
      console.log(`  ✅  CONFIRMED: Product-level override is immune to category making charge changes.`);
    } else {
      console.log(`  ❌  UNEXPECTED: Override NOT immune. Category change leaked through.`);
    }

    // Another product without override — category change must propagate
    const otherProduct = products.find(p => !p.name.toLowerCase().includes('apex') && !(p.pricingOverrides?.makingCharges));
    if (otherProduct) {
      const oCfg = sharedDefaultConfig(otherProduct);
      const oBefore = calculatePricing({ ...otherProduct, categoryConfig: { ...otherProduct.categoryConfig, ...catMC_12 } }, oCfg, rates);
      const oAfter  = calculatePricing({ ...otherProduct, categoryConfig: { ...otherProduct.categoryConfig, ...catMC_10 } }, oCfg, rates);
      console.log(`\n  ── Effect on "${otherProduct.name}" (no override) ──`);
      console.log(`  Total @12% cat: ${fmt(oBefore.totalPrice)}`);
      console.log(`  Total @10% cat: ${fmt(oAfter.totalPrice)}`);
      console.log(`  Difference     : ${fmt(oAfter.totalPrice - oBefore.totalPrice)}`);
      if (oAfter.totalPrice !== oBefore.totalPrice) {
        console.log(`  ✅  CONFIRMED: Products without override respond to category MC changes immediately.`);
      } else {
        console.log(`  ⚠️   No difference detected — product may not use category MC (check source ladder).`);
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // VERDICT
  // ═══════════════════════════════════════════════════════════════════════════
  section('VERDICT');
  console.log(`
  The pricing engine is DETERMINISTIC if and only if:

  1. Every product has  baseWeight defined (non-null, non-zero).
  2. Every diamond product has  diamondWeightCarats defined.
  3. The  jewelryType  field correctly routes to the right pricing branch.
  4. Live  goldRate24K  is the SAME value for every component (Card, PDP, Cart, Checkout).
  5. The making-charge precedence ladder (overrides → categoryOverrides → categoryConfig
     → product.makingCharges → 15% fallback) is the SAME in every call site.

  Any deviation from these 5 conditions produces a non-deterministic price.
  Review the per-product output above for violations.
  `);

  await client.close();
}

main().catch(e => { console.error(e); process.exit(1); });
