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

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String,
  description: String,
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

async function run() {
  await mongoose.connect(MONGODB_URI);
  const categories = await Category.find({});
  console.log(`Found ${categories.length} categories in DB:`);
  categories.forEach(c => {
    console.log(`- Name: "${c.name}" | Slug: "${c.slug}"`);
  });
  await mongoose.disconnect();
}

run();
