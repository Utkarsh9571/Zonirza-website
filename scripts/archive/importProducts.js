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

const DATA_FILE = path.join(__dirname, '../normalizedProducts.json');
const CATEGORY_DATA_FILE = path.join(__dirname, '../cleanCategories.json');

// --- Schemas (Matching models/*.ts) ---
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
  }
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

async function importData() {
  let pSuccessCount = 0;
  let cSuccessCount = 0;

  try {
    console.log('--- Database Migration ---');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('Connected successfully.\n');

    // 1. Process Categories
    if (fs.existsSync(CATEGORY_DATA_FILE)) {
      const categoriesData = JSON.parse(fs.readFileSync(CATEGORY_DATA_FILE, 'utf8'));
      console.log(`Read ${categoriesData.length} categories from ${CATEGORY_DATA_FILE}`);
      
      console.log('Clearing existing categories...');
      await Category.deleteMany({});
      
      console.log(`Inserting ${categoriesData.length} categories...`);
      const cResult = await Category.insertMany(categoriesData, { ordered: false });
      cSuccessCount = cResult.length;
    }

    // 2. Process Products
    if (!fs.existsSync(DATA_FILE)) {
      console.error(`Error: ${DATA_FILE} not found. Please run transformProducts.js first.`);
      process.exit(1);
    }

    const productsData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    console.log(`Read ${productsData.length} products from ${DATA_FILE}`);

    console.log('Clearing existing products...');
    await Product.deleteMany({});

    console.log(`Inserting ${productsData.length} products...`);
    const pResult = await Product.insertMany(productsData, { ordered: false });
    pSuccessCount = pResult.length;

    console.log('\n--- Migration Summary ---');
    console.log(`Categories in DB: ${await Category.countDocuments()}`);
    console.log(`Products in DB:   ${await Product.countDocuments()}`);
    
    console.log('\nMigration completed successfully!');
    process.exit(0);
  } catch (error) {
    if (error.name === 'BulkWriteError' || error.name === 'MongoBulkWriteError') {
      console.log('\n--- Migration Summary (with some write errors) ---');
      console.log(`Check for duplicate slugs or validation issues.`);
      process.exit(0);
    } else {
      console.error('Import failed with a critical error:', error);
      process.exit(1);
    }
  }
}

importData();
