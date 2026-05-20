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
  images: [String],
  tags: [String],
  isActive: Boolean,
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function runAudit() {
  try {
    console.log('--- Data Integrity Audit ---');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB\n');

    const allProducts = await Product.find({});
    console.log(`Total Products: ${allProducts.length}`);

    // 1. Duplicate Slugs
    const slugs = allProducts.map(p => p.slug);
    const duplicateSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    console.log(`Duplicate Slugs: ${duplicateSlugs.length}`);
    if (duplicateSlugs.length > 0) {
      console.log('Duplicates:', [...new Set(duplicateSlugs)].slice(0, 5), '...');
    }

    // 2. Missing Images
    const noImages = allProducts.filter(p => !p.images || p.images.length === 0);
    console.log(`Products without Images: ${noImages.length}`);

    // 3. Category Distribution
    const categories = {};
    allProducts.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    console.log('\nCategory Distribution:');
    Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
      console.log(`- ${cat}: ${count}`);
    });

    // 4. Tag Analysis
    const tags = {};
    allProducts.forEach(p => {
      (p.tags || []).forEach(t => {
        tags[t] = (tags[t] || 0) + 1;
      });
    });
    console.log('\nTop Tags:');
    Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([tag, count]) => {
      console.log(`- ${tag}: ${count}`);
    });

    // 5. Normalization Leakage Check (Gold vs Silver in same product)
    const leakage = allProducts.filter(p => {
      const name = p.name.toLowerCase();
      const tags = (p.tags || []).join(' ').toLowerCase();
      return (name.includes('gold') && name.includes('silver')) || (tags.includes('gold') && tags.includes('silver'));
    });
    console.log(`\nMixed-Metal Leakage Detected: ${leakage.length}`);
    if (leakage.length > 0) {
      console.log('Sample Leakage:', leakage.slice(0, 3).map(p => p.name));
    }

    console.log('\n--- Audit Complete ---');
    process.exit(0);
  } catch (err) {
    console.error('Audit failed:', err);
    process.exit(1);
  }
}

runAudit();
