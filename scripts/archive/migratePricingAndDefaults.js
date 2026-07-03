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

// Product Schema Definition for Script
const ProductSchema = new mongoose.Schema({
  name: String,
  slug: String,
  category: String,
  isActive: Boolean,
  baseWeight: Number,
  makingCharges: Number,
  specs: { type: Map, of: String },
  configurableOptions: {
    metals: [String],
    purities: [String],
    sizes: [String],
    stones: [String],
    customizations: [String]
  },
  jewelryType: String,
  defaultColor: String,
  defaultSize: String,
  legacyConfigurableOptions: mongoose.Schema.Types.Mixed,
  legacySpecs: mongoose.Schema.Types.Mixed
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// Settings Schema Definition for Script
const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Zoniraz Jewelers' },
  pricingFactors: {
    gstPercentage: { type: Number, default: 3 },
    shippingBaseCharge: { type: Number, default: 0 },
    freeShippingThreshold: { type: Number, default: 5000 },
    metalRates: {
      gold24k: { type: Number, default: 6500 },
      silver: { type: Number, default: 100 },
      platinum: { type: Number, default: 4000 }
    },
    stonePrices: { type: Map, of: Number },
    purityMultipliers: { type: Map, of: Number },
    ringsOffset: { type: Number, default: 0.12 },
    chainsOffset: { type: Number, default: 0.25 },
    braceletsOffset: { type: Number, default: 0.15 },
    banglesOffset: { type: Number, default: 0.15 }
  }
});

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // 1. Initialize Site Settings with Pricing Rules
    console.log('Initializing/Updating System Settings with Pricing Rules...');
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    const oldFactors = settings.pricingFactors || {};
    const oldMetalRates = oldFactors.metalRates || {};

    settings.pricingFactors = {
      gstPercentage: oldFactors.gstPercentage || 3,
      shippingBaseCharge: oldFactors.shippingBaseCharge || 0,
      freeShippingThreshold: oldFactors.freeShippingThreshold || 5000,
      metalRates: {
        gold24k: oldMetalRates.gold24k || 6500,
        silver: oldMetalRates.silver || 100,
        platinum: oldMetalRates.platinum || 4000
      },
      stonePrices: oldFactors.stonePrices || {
        'EF-VVS': 85000,
        'GH-VS': 65000,
        'GHI-VS': 55000,
        'FG-SI': 45000,
        'IJ-SI': 35000,
        'Diamond-Standard': 40000,
        'None': 0
      },
      purityMultipliers: oldFactors.purityMultipliers || {
        '24K': 1.0,
        '22K': 0.916,
        '18K': 0.750,
        '14K': 0.585,
        '9K': 0.375
      },
      ringsOffset: oldFactors.ringsOffset !== undefined ? oldFactors.ringsOffset : 0.12,
      chainsOffset: oldFactors.chainsOffset !== undefined ? oldFactors.chainsOffset : 0.25,
      braceletsOffset: oldFactors.braceletsOffset !== undefined ? oldFactors.braceletsOffset : 0.15,
      banglesOffset: oldFactors.banglesOffset !== undefined ? oldFactors.banglesOffset : 0.15
    };

    await settings.save();
    console.log('Site settings pricing engine rules synced.');

    // 2. Migrate Products
    const products = await Product.find({});
    console.log(`Migrating ${products.length} products with defaults and legacy backups...`);

    let migratedCount = 0;
    for (const p of products) {
      // Create legacy backups if not already backed up
      if (!p.legacyConfigurableOptions) {
        p.legacyConfigurableOptions = p.configurableOptions;
      }
      if (!p.legacySpecs) {
        p.legacySpecs = p.specs;
      }

      // Set default color
      if (!p.defaultColor) {
        // Try to read color from metal or default to Yellow Gold
        const metals = p.configurableOptions?.metals || [];
        p.defaultColor = metals.includes('Yellow Gold') ? 'Yellow Gold' : (metals[0] || 'Yellow Gold');
      }

      // Set default sizes based on category
      const category = (p.category || '').toLowerCase();
      if (!p.defaultSize) {
        if (category.includes('ring')) {
          p.defaultSize = '12';
        } else if (category.includes('chain') || category.includes('necklace') || category.includes('mangalsutra')) {
          p.defaultSize = '20';
        } else if (category.includes('bracelet') || category.includes('anklet')) {
          p.defaultSize = 'M';
        } else if (category.includes('bangle')) {
          p.defaultSize = '2.4';
        } else {
          p.defaultSize = '';
        }
      }

      // Set default base weight if zero or undefined
      if (!p.baseWeight || p.baseWeight === 0) {
        // Fallback: use a sensible weight depending on category
        if (category.includes('ring')) p.baseWeight = 3.5;
        else if (category.includes('earring') || category.includes('stud')) p.baseWeight = 2.5;
        else if (category.includes('pendant')) p.baseWeight = 1.8;
        else if (category.includes('necklace') || category.includes('mangalsutra')) p.baseWeight = 12.0;
        else if (category.includes('chain')) p.baseWeight = 8.0;
        else if (category.includes('bracelet')) p.baseWeight = 6.0;
        else if (category.includes('bangle')) p.baseWeight = 14.0;
        else p.baseWeight = 4.0;
      }

      // Set default making charges if zero or undefined
      if (!p.makingCharges || p.makingCharges === 0) {
        // Set standard making charges (e.g. ₹950 per gram or default flat rate depending on category)
        p.makingCharges = Math.round(p.baseWeight * 950);
      }

      // Save product changes
      p.markModified('legacyConfigurableOptions');
      p.markModified('legacySpecs');
      await p.save();
      migratedCount++;
    }

    console.log(`Migration complete! Successfully migrated ${migratedCount} products.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error running migration script:', err);
    process.exit(1);
  }
}

run();
