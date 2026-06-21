/* eslint-disable */
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
  console.error("MONGODB_URI is not found in .env.local");
  process.exit(1);
}

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  images: { type: [String], required: true },
  videoUrl: { type: String },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true, default: 0 },
  makingCharges: { type: Number, default: 0 },
  baseWeight: { type: Number, default: 0 },
  stockStatus: { type: String, enum: ['in-stock', 'out-of-stock'], default: 'in-stock' },
  isActive: { type: Boolean, default: true },
  tags: { type: [String], default: [] },
  specs: { type: Map, of: String, default: {} },
  variantImages: { type: Map, of: String, default: {} },
  productVideos: { type: [String], default: [] },
  enableCardVideoPreview: { type: Boolean, default: false },
  cardPreviewVideo: { type: String },
  cardPreviewThumbnail: { type: String },
  hasDiamond: { type: Boolean, default: false },
  hasStone: { type: Boolean, default: false },
  stoneType: { type: String },
  goldPurityOptions: { type: [String], default: [] },
  jewelryType: { type: String, enum: ['diamond', 'stone', 'gold'], default: 'gold' },
  defaultColor: { type: String, default: 'Yellow Gold' },
  defaultSize: { type: String },
  readyToShipVariants: { type: [String], default: [] },
  configurableOptions: {
    metals: [String],
    purities: [String],
    sizes: [String],
    stones: [String],
    customizations: [String]
  },
  pricingOverrides: {
    stonePrices: { type: Map, of: Number },
    makingCharges: { type: Number },
    sizeWeightOffset: { type: Number }
  }
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const newCategory = {
  name: 'Gold Coins',
  slug: 'gold-coins',
  image: 'https://images.unsplash.com/photo-1618409399922-04aba3629f4c?auto=format&fit=crop&q=80&w=800',
  description: 'Pure 24K certified gold coins for wealth preservation, auspicious occasions, and corporate gifting.'
};

const solitaireProducts = [
  {
    name: "Aurelia Princess Solitaire Ring",
    slug: "aurelia-princess-solitaire-ring",
    category: "rings",
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800"],
    description: "An signature solitaire ring featuring an exquisite, hand-selected princess-cut diamond set in a refined four-prong micro-pave yellow gold band. Accompanied by IGI certification, representing the absolute pinnacle of luxury.",
    basePrice: 45000,
    makingCharges: 4500,
    baseWeight: 3.8,
    stockStatus: 'in-stock',
    isActive: true,
    tags: ['solitaire', 'diamond', 'rings', 'premium'],
    specs: {
      sku: "ZON-SL-RG-001",
      finish: "High Polish",
      certification: "IGI Certified",
      occasion: "Engagement",
      craftsmanship: "Atelier Handcrafted",
      settingType: "Prong Setting",
      diamondWeight: "1.00 ct"
    },
    hasDiamond: true,
    jewelryType: 'diamond',
    goldPurityOptions: ['9K', '14K', '18K'],
    defaultColor: 'Yellow Gold',
    defaultSize: '12',
    configurableOptions: {
      metals: ['Yellow Gold', 'Rose Gold', 'White Gold'],
      purities: ['9K', '14K', '18K'],
      sizes: ['10', '12', '14', '16'],
      stones: ['0-50 ct', '0-75 ct', '1-00 ct', '1-50 ct', '2-00 ct'],
      customizations: ['Engraving']
    },
    pricingOverrides: {
      stonePrices: {
        '0-50 ct': 35000,
        '0-75 ct': 65000,
        '1-00 ct': 120000,
        '1-50 ct': 240000,
        '2-00 ct': 450000
      }
    }
  },
  {
    name: "Lumina Round Solitaire Earrings",
    slug: "lumina-round-solitaire-earrings",
    category: "earrings",
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"],
    description: "Classic round brilliant cut solitaire studs set in 18K white gold baskets. Features high-clarity diamonds selected by our master gemologists for unparalleled fire and brilliance.",
    basePrice: 55000,
    makingCharges: 3500,
    baseWeight: 2.4,
    stockStatus: 'in-stock',
    isActive: true,
    tags: ['solitaire', 'diamond', 'earrings', 'studs'],
    specs: {
      sku: "ZON-SL-ER-002",
      finish: "High Polish",
      certification: "GIA Certified",
      occasion: "Everyday Luxury",
      craftsmanship: "Precision Casted",
      settingType: "Basket Setting",
      diamondWeight: "0.75 ct"
    },
    hasDiamond: true,
    jewelryType: 'diamond',
    goldPurityOptions: ['9K', '14K', '18K'],
    defaultColor: 'White Gold',
    configurableOptions: {
      metals: ['Yellow Gold', 'Rose Gold', 'White Gold'],
      purities: ['9K', '14K', '18K'],
      sizes: ['base'],
      stones: ['0-50 ct', '0-75 ct', '1-00 ct', '1-50 ct'],
      customizations: ['Screw Back', 'Push Back']
    },
    pricingOverrides: {
      stonePrices: {
        '0-50 ct': 32000,
        '0-75 ct': 58000,
        '1-00 ct': 115000,
        '1-50 ct': 230000
      }
    }
  },
  {
    name: "Amara Heart Solitaire Pendant",
    slug: "amara-heart-solitaire-pendant",
    category: "pendants",
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"],
    description: "An elegant heart-shaped solitaire diamond pendant suspended on a sleek 18K gold chain. Crafted to rest beautifully on the neckline, symbolizing infinite grace.",
    basePrice: 38000,
    makingCharges: 4000,
    baseWeight: 1.9,
    stockStatus: 'in-stock',
    isActive: true,
    tags: ['solitaire', 'diamond', 'pendants', 'heart'],
    specs: {
      sku: "ZON-SL-PD-003",
      finish: "High Polish",
      certification: "SGL Certified",
      occasion: "Anniversary",
      craftsmanship: "Atelier Handcrafted",
      settingType: "V-Prong",
      diamondWeight: "0.50 ct"
    },
    hasDiamond: true,
    jewelryType: 'diamond',
    goldPurityOptions: ['9K', '14K', '18K'],
    defaultColor: 'Rose Gold',
    configurableOptions: {
      metals: ['Yellow Gold', 'Rose Gold', 'White Gold'],
      purities: ['9K', '14K', '18K'],
      sizes: ['16 inches', '18 inches'],
      stones: ['0-50 ct', '0-75 ct', '1-00 ct'],
      customizations: ['Standard bail', 'Luxury pave bail']
    },
    pricingOverrides: {
      stonePrices: {
        '0-50 ct': 36000,
        '0-75 ct': 66000,
        '1-00 ct': 122000
      }
    }
  }
];

const goldCoinProducts = [
  {
    name: "Zoniraz 24K Laxmi Gold Coin",
    slug: "zoniraz-24k-laxmi-gold-coin",
    category: "gold-coins",
    images: ["https://images.unsplash.com/photo-1618409399922-04aba3629f4c?auto=format&fit=crop&q=80&w=800"],
    description: "Blessed 24K pure (999.9) gold coin embossed with Goddess Laxmi. Ideal for Diwali, Akshaya Tritiya, weddings, and family wealth savings. Protected by tamper-proof luxury certicard packing.",
    basePrice: 7200, // per-gram rate base
    makingCharges: 350,
    baseWeight: 1.0,
    stockStatus: 'in-stock',
    isActive: true,
    tags: ['coin', 'gold', '24k', 'savings', 'gifting'],
    specs: {
      sku: "ZON-COIN-LXM-01",
      finish: "Mint Lustre Finish",
      certification: "BIS Hallmarked 999.9 Pure",
      occasion: "Auspicious Savings",
      craftsmanship: "Refined Laser Engraving",
      goldKaratage: "24K"
    },
    hasDiamond: false,
    jewelryType: 'gold',
    goldPurityOptions: ['24K'],
    defaultColor: 'Yellow Gold',
    defaultSize: '1g',
    configurableOptions: {
      metals: ['Yellow Gold'],
      purities: ['24K'],
      sizes: ['1g', '2g', '5g', '10g', '20g', '50g'],
      stones: ['None'],
      customizations: ['Standard Certicard', 'Luxury Gift Box']
    },
    pricingOverrides: {
      makingCharges: 350,
      sizeWeightOffset: 0 // handled by size multiplier
    }
  }
];

async function run() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGODB_URI);
    
    // Check if category exists
    console.log("Upserting Category 'Gold Coins'...");
    await Category.findOneAndUpdate(
      { slug: 'gold-coins' },
      newCategory,
      { upsert: true, returnDocument: 'after' }
    );
    
    console.log("Removing any previously seeded solitaire/coin duplicates...");
    const slugsToDelete = [
      ...solitaireProducts.map(p => p.slug),
      ...goldCoinProducts.map(p => p.slug)
    ];
    await Product.deleteMany({ slug: { $in: slugsToDelete } });

    console.log("Inserting premium Solitaires...");
    await Product.insertMany(solitaireProducts);

    console.log("Inserting 24K Gold Coins...");
    await Product.insertMany(goldCoinProducts);
    
    console.log("Seeding catalog expansion completed successfully!");
  } catch (error) {
    console.error("Error seeding catalog:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

run();
