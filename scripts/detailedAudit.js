const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
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

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  slug: String,
  category: String,
  description: String,
  tags: [String],
  isActive: Boolean,
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function run() {
  await mongoose.connect(MONGODB_URI);
  const products = await Product.find({
    category: { $nin: ['earrings', 'rings', 'pendants', 'nose-pin'] }
  });

  console.log(`Found ${products.length} products to investigate:`);
  products.forEach(p => {
    console.log(`- Name: "${p.name}" | Category: "${p.category}" | Slug: "${p.slug}"`);
  });

  await mongoose.disconnect();
}

run();
