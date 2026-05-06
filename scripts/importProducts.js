const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
// Try to load MONGODB_URI from .env.local manually since dotenv might not be installed
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
  MONGODB_URI = 'mongodb+srv://admin:admin@cluster0.mongodb.net/jewellery?retryWrites=true&w=majority';
}

const DATA_FILE = path.join(__dirname, '../cleanProducts.json');

// --- Product Schema (Matches models/Product.ts) ---
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  images: { type: [String], required: true },
  videoUrl: { type: String },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  tags: { type: [String], default: [] },
  specs: { type: Map, of: String, default: {} },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function importProducts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000, // Increase timeout to 15s
      connectTimeoutMS: 15000,
    });
    console.log('Connected successfully.');

    // 1. Read cleaned data
    if (!fs.existsSync(DATA_FILE)) {
      console.error(`Error: ${DATA_FILE} not found. Please run parseProducts.js first.`);
      process.exit(1);
    }

    const productsData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    console.log(`Read ${productsData.length} products from ${DATA_FILE}`);

    // 2. Clear existing products
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Database cleared.');

    // 3. Prepare and Insert products
    const productsToInsert = productsData.map(p => ({
      name: p.name,
      slug: p.slug,
      category: String(p.category_id || 'uncategorized'),
      images: p.images,
      description: p.description,
      price: p.price || 0,
      tags: p.tags || [],
      specs: {
        price_str: String(p.price || 0)
      }
    }));

    console.log(`Inserting ${productsToInsert.length} products...`);
    const result = await Product.create(productsToInsert);
    
    console.log(`\nInserted ${result.length} products successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

importProducts();
