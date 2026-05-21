const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.*)/);
    if (match && match[1]) {
      MONGODB_URI = match[1].trim();
    }
  }
}

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI not found in environment or .env.local');
  process.exit(1);
}

const DATA_FILE = path.join(__dirname, '../cleanProducts.json');

// --- Schemas (Matching models/Product.ts without primaryMetal) ---
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
  tags: { type: [String], default: [] },
  specs: { type: Map, of: String, default: {} },
  configurableOptions: {
    metals: [String],
    purities: [String],
    sizes: [String],
    stones: [String],
    customizations: [String]
  },
  stockStatus: { type: String, default: 'in-stock' },
  isActive: { type: Boolean, default: true },
  variantImages: { type: Map, of: String, default: {} }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function restoreData() {
  try {
    console.log('--- Database Restoration ---');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('Connected successfully.\n');

    if (!fs.existsSync(DATA_FILE)) {
      console.error(`Error: ${DATA_FILE} not found.`);
      process.exit(1);
    }

    const rawData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    console.log(`Read ${rawData.length} products from ${DATA_FILE}`);

    // Transform Data
    const productsData = rawData.map(product => {
      // 1. Replace 'default' with 'white-gold' in configurableOptions.metals
      if (product.configurableOptions && product.configurableOptions.metals) {
        product.configurableOptions.metals = product.configurableOptions.metals.map(m => 
          m.toLowerCase() === 'default' ? 'white-gold' : m
        );
      }

      // 2. Replace 'default' with 'white-gold' in specs.metal
      if (product.specs && product.specs.metal) {
        product.specs.metal = product.specs.metal
          .split(',')
          .map(m => m.trim())
          .map(m => m.toLowerCase() === 'default' ? 'white-gold' : m)
          .join(', ');
      }
      
      // 3. Remove primaryMetal if it exists
      if (product.primaryMetal) {
        delete product.primaryMetal;
      }
      
      // Note: We leave the 'default-*.jpg' strings in the images array untouched as requested.

      return product;
    });

    console.log('Clearing existing metal-split products...');
    const deleteResult = await Product.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} products.\n`);

    console.log(`Inserting ${productsData.length} restored products...`);
    const pResult = await Product.insertMany(productsData, { ordered: false });
    
    console.log('\n--- Restoration Summary ---');
    console.log(`Original Products Restored: ${pResult.length}`);
    console.log(`Total Products in DB:       ${await Product.countDocuments()}`);
    
    console.log('\nRestoration completed successfully!');
    process.exit(0);
  } catch (error) {
    if (error.name === 'BulkWriteError' || error.name === 'MongoBulkWriteError') {
      console.log('\n--- Restoration Summary (with some write errors) ---');
      console.log(`Check for duplicate slugs or validation issues.`);
      process.exit(0);
    } else {
      console.error('Restoration failed with a critical error:', error);
      process.exit(1);
    }
  }
}

restoreData();
