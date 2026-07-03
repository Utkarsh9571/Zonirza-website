
const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://zonirazjewelhouse_db_user:zyrCfjZ1wVDm2kdf@cluster0.dnlzvq8.mongodb.net/?appName=Cluster0";

const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const CategorySchema = new mongoose.Schema({}, { strict: false });
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

async function getProducts() {
  await mongoose.connect(MONGODB_URI);
  
  const products = await Product.find({}).lean();
  
  const categoryMap = {};
  const categories = await Category.find({}).lean();
  categories.forEach(cat => categoryMap[cat.slug || cat.name?.toLowerCase()] = cat);
  
  console.log("Chains:");
  products.filter(p => p.category === 'chains').slice(0,2).forEach(p => console.log(JSON.stringify({name: p.name, slug: p.slug}, null, 2)));
  
  console.log("\nBracelets:");
  products.filter(p => p.category === 'bracelets').slice(0,2).forEach(p => console.log(JSON.stringify({name: p.name, slug: p.slug}, null, 2)));
  
  console.log("\nGemstone Products:");
  products.filter(p => p.specs?.stoneType && !p.specs?.stoneType?.toLowerCase().includes('diamond')).slice(0,2).forEach(p => console.log(JSON.stringify({name: p.name, slug: p.slug}, null, 2)));
  
  await mongoose.disconnect();
}

getProducts();
