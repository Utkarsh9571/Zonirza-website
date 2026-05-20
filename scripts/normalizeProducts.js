const fs = require('fs');
const path = require('path');

/**
 * Migration script to normalize product data by splitting metal variants into independent products.
 * Also maps products to the new category structure defined in NAVIGATION_DATA.
 */

const INPUT_FILE = path.join(__dirname, '../cleanProducts.json');
const OUTPUT_FILE = path.join(__dirname, '../normalizedProducts.json');
const REPORT_FILE = path.join(__dirname, '../migrationReport.json');

// Constants for normalization
const METALS = {
  'yellow-gold': { label: 'Yellow Gold', keywords: ['yellow-gold', 'yellow gold', 'yg'] },
  'rose-gold': { label: 'Rose Gold', keywords: ['rose-gold', 'rose gold', 'rg'] },
  'white-gold': { label: 'White Gold', keywords: ['white-gold', 'white gold', 'wg'] },
  'silver': { label: 'Silver', keywords: ['silver', 'sl'] },
  'platinum': { label: 'Platinum', keywords: ['platinum', 'pt'] }
};

// Target categories from NAVIGATION_DATA (simplified for mapping)
const CATEGORY_MAPPING = [
  { name: 'rings', keywords: ['ring', 'band', 'engagement', 'finger ring'] },
  { name: 'earrings', keywords: ['earring', 'stud', 'jhumka', 'hoop', 'drop', 'dangler', 'tops', 'bali'] },
  { name: 'necklaces', keywords: ['necklace', 'choker', 'haram', 'tanmaniya', 'collier'] },
  { name: 'bangles', keywords: ['bangle', 'kada', 'bracelet bangle', 'churi'] },
  { name: 'bracelets', keywords: ['bracelet'] },
  { name: 'pendants', keywords: ['pendant', 'locket'] },
  { name: 'nose-pin', keywords: ['nose pin', 'nose-pin', 'nath', 'nosepin', 'mookuthi'] },
  { name: 'mangalsutra', keywords: ['mangalsutra', 'mangal sutra', 'thali'] },
  { name: 'chains', keywords: ['chain'] },
  { name: 'necklace-set', keywords: ['necklace set', 'set'] }
];

function normalize() {
  console.log('--- Starting Database Normalization & Category Restructuring ---');
  
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Error: Input file ${INPUT_FILE} not found.`);
    process.exit(1);
  }

  const rawProducts = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  const normalizedProducts = [];
  const report = {
    originalCount: rawProducts.length,
    splitCount: 0,
    totalCount: 0,
    categoryStats: {},
    emptyCategories: [],
    unmatchedProducts: []
  };

  rawProducts.forEach(product => {
    // 1. Detect Variants
    const detectedMetals = detectMetals(product);
    
    if (detectedMetals.length <= 1) {
      // Single metal or unknown - just clean it up
      const p = prepareProduct(product, detectedMetals[0] || null);
      if (p) {
        normalizedProducts.push(p);
        updateStats(report, p);
      }
    } else {
      // Multiple metals - SPLIT!
      report.splitCount++;
      detectedMetals.forEach(metalKey => {
        const variant = prepareProduct(product, metalKey);
        if (variant) {
          normalizedProducts.push(variant);
          updateStats(report, variant);
        }
      });
    }
  });

  // 2. Category Coverage Analysis
  report.totalCount = normalizedProducts.length;
  checkCategoryCoverage(normalizedProducts, report);

  // 3. Save Results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(normalizedProducts, null, 2));
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  console.log(`\nMigration Complete:`);
  console.log(`- Original Products: ${report.originalCount}`);
  console.log(`- Products Split: ${report.splitCount}`);
  console.log(`- Final Normalized Products: ${report.totalCount}`);
  console.log(`- Empty Categories Found: ${report.emptyCategories.length}`);
  console.log(`- Results saved to ${OUTPUT_FILE}`);
  console.log(`- Detailed report saved to ${REPORT_FILE}`);
}

/**
 * Detects metals based on configurableOptions, specs, and image filenames.
 */
function detectMetals(product) {
  const detected = new Set();
  
  // From Configurable Options
  if (product.configurableOptions && product.configurableOptions.metals) {
    product.configurableOptions.metals.forEach(m => detected.add(m.toLowerCase()));
  }
  
  // From Specs
  if (product.specs && product.specs.metal) {
    product.specs.metal.split(',').forEach(m => detected.add(m.trim().toLowerCase()));
  }
  
  // From Images (as fallback or verification)
  product.images.forEach(img => {
    Object.keys(METALS).forEach(key => {
      if (img.toLowerCase().includes(key)) detected.add(key);
    });
  });

  return Array.from(detected);
}

/**
 * Prepares a single product object for a specific metal variant.
 */
function prepareProduct(original, metalKey) {
  const metalInfo = METALS[metalKey] || null;
  const p = { ...original };

  // 1. Update Name & Slug
  if (metalInfo) {
    p.name = `${original.name} - ${metalInfo.label}`;
    p.slug = `${original.slug}-${metalKey}`;
  }

  // 2. Filter Images
  if (metalKey) {
    p.images = original.images.filter(img => img.toLowerCase().includes(metalKey));
    // If no images matched the metal key specifically, keep all (legacy fallback)
    if (p.images.length === 0) p.images = original.images;
  }

  // 3. Update Specs & Tags
  p.tags = [...(original.tags || [])];
  p.specs = { ...original.specs };
  
  if (metalKey) {
    p.specs.metal = metalKey;
    p.tags.push(metalKey.replace('-', ' '));
    if (metalKey.includes('gold')) p.tags.push('gold');
  }

  // 4. Assign Category intelligently
  const targetCat = CATEGORY_MAPPING.find(cat => 
    p.name.toLowerCase().includes(cat.name) || 
    cat.keywords.some(k => p.name.toLowerCase().includes(k)) ||
    (p.category && p.category.toLowerCase().includes(cat.name))
  );

  if (targetCat) {
    p.category = targetCat.name;
    if (!p.tags.includes(targetCat.name)) p.tags.push(targetCat.name);
  }

  // 5. Cleanup Configurable Options (Keep others like purity/size, but restrict metal)
  if (p.configurableOptions) {
    p.configurableOptions = { ...p.configurableOptions };
    if (metalKey) {
      p.configurableOptions.metals = [metalKey];
    }
  }

  // Ensure unique tags
  p.tags = [...new Set(p.tags.map(t => t.toLowerCase()))];

  return p;
}

function updateStats(report, product) {
  const cat = product.category || 'unassigned';
  report.categoryStats[cat] = (report.categoryStats[cat] || 0) + 1;
}

function checkCategoryCoverage(products, report) {
  // We should ideally import the NAVIGATION_DATA here, but for the script we use the mapping
  CATEGORY_MAPPING.forEach(cat => {
    if (!report.categoryStats[cat.name]) {
      report.emptyCategories.push(cat.name);
    }
  });
}

normalize();
