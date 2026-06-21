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
  const allProducts = await Product.find({});
  
  const searchTerms = ['necklace', 'chain', 'bracelet', 'bangle', 'mangalsutra', 'anklet', 'brooch', 'nose pin', 'nosepin'];
  const matches = {};
  
  searchTerms.forEach(term => {
    matches[term] = [];
  });
  
  allProducts.forEach(p => {
    const name = p.name.toLowerCase();
    const desc = p.description ? p.description.toLowerCase() : '';
    searchTerms.forEach(term => {
      if (name.includes(term) || desc.includes(term)) {
        matches[term].push({ name: p.name, category: p.category, slug: p.slug });
      }
    });
  });

  Object.entries(matches).forEach(([term, list]) => {
    console.log(`\nTerm "${term}": Found ${list.length} matches.`);
    if (list.length > 0) {
      console.log('Sample:', list.slice(0, 5));
    }
  });

  await mongoose.disconnect();
}

run();
