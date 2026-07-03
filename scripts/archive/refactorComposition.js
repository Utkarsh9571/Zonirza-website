const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let MONGODB_URI = '';
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/MONGODB_URI=(.*)/);
  if (match) MONGODB_URI = match[1].trim();
}

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found');
  process.exit(1);
}

const ProductSchema = new mongoose.Schema({
  name: String,
  slug: String,
  category: String,
  description: String,
  tags: [String],
  specs: { type: Map, of: String },
  configurableOptions: {
    metals: [String],
    purities: [String],
    sizes: [String],
    stones: [String],
    customizations: [String]
  },
  hasDiamond: Boolean,
  hasStone: Boolean,
  stoneType: String,
  goldPurityOptions: [String],
  jewelryType: String
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const GEMSTONES = [
  'ruby', 'emerald', 'sapphire', 'topaz', 'amethyst', 'opal', 'garnet', 'moissanite', 'cz', 'gemstone', 'zirconia', 'spinel', 'aquamarine', 'citrine', 'pearl', 'color stone'
];

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.\nStarting reclassification...');

    const products = await Product.find({});
    console.log(`Auditing ${products.length} products...\n`);

    let stats = {
      diamond: 0,
      stone: 0,
      gold: 0
    };

    for (const p of products) {
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const tags = (p.tags || []).map(t => t.toLowerCase());
      
      let specsObj = {};
      if (p.specs instanceof Map) {
        specsObj = Object.fromEntries(p.specs);
      } else if (p.specs) {
        specsObj = p.specs;
      }
      
      const stoneSpec = (specsObj.stone || specsObj.stoneName || specsObj.stoneType || '').toLowerCase();

      // Rule 1: Check Diamond
      const hasDiamondKeyword = 
        name.includes('diamond') || 
        name.includes('solitaire') || 
        desc.includes('diamond') || 
        tags.includes('diamond') || 
        stoneSpec.includes('diamond');

      // Rule 2: Check Gemstone
      let matchedGem = '';
      const hasStoneKeyword = GEMSTONES.some(gem => {
        const found = name.includes(gem) || desc.includes(gem) || tags.includes(gem) || stoneSpec.includes(gem);
        if (found) {
          matchedGem = gem;
        }
        return found;
      });

      let jewelryType = 'gold';
      let hasDiamond = false;
      let hasStone = false;
      let stoneType = '';
      let goldPurityOptions = [];

      if (hasDiamondKeyword) {
        // Diamonds take precedence due to setting security constraints
        jewelryType = 'diamond';
        hasDiamond = true;
        goldPurityOptions = ['9K', '14K', '18K'];
        stats.diamond++;
      } else if (hasStoneKeyword) {
        jewelryType = 'stone';
        hasStone = true;
        stoneType = matchedGem.charAt(0).toUpperCase() + matchedGem.slice(1);
        goldPurityOptions = ['9K', '14K', '18K', '22K'];
        stats.stone++;
      } else {
        jewelryType = 'gold';
        goldPurityOptions = ['18K', '22K'];
        stats.gold++;
      }

      // Update fields
      p.jewelryType = jewelryType;
      p.hasDiamond = hasDiamond;
      p.hasStone = hasStone;
      if (stoneType) p.stoneType = stoneType;
      p.goldPurityOptions = goldPurityOptions;

      // Overwrite allowed configurator purities to enforce business rules
      if (!p.configurableOptions) {
        p.configurableOptions = {};
      }
      p.configurableOptions.purities = goldPurityOptions;

      // Auto-populate specs.stoneType/stoneName for storefront
      if (!p.specs) {
        p.specs = new Map();
      }
      
      if (jewelryType === 'diamond') {
        p.specs.set('stoneType', 'Diamond');
        // Ensure diamond weight is set from spec stone weight or default if missing
        if (!p.specs.get('diamondWeight') && p.specs.get('stoneWeight')) {
          p.specs.set('diamondWeight', p.specs.get('stoneWeight'));
        }
        p.specs.delete('stoneWeight'); // Remove general stone weight
      } else if (jewelryType === 'stone') {
        p.specs.set('stoneType', stoneType);
        if (!p.specs.get('stoneWeight') && p.specs.get('diamondWeight')) {
          p.specs.set('stoneWeight', p.specs.get('diamondWeight'));
        }
        p.specs.delete('diamondWeight'); // Remove diamond weight
      } else {
        // Gold Jewelry - remove stone attributes
        p.specs.delete('stoneType');
        p.specs.delete('stoneWeight');
        p.specs.delete('diamondWeight');
        p.specs.delete('stone');
      }

      await p.save();
    }

    console.log('Reclassification Complete!');
    console.log('---------------------------');
    console.log(`Diamond Jewelry:    ${stats.diamond}`);
    console.log(`Stone Jewelry:      ${stats.stone}`);
    console.log(`Plain Gold Jewelry: ${stats.gold}`);
    console.log(`Total Audited:      ${products.length}`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error during migration:', err);
    process.exit(1);
  }
}

run();
