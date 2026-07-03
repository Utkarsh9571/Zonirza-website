
const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://zonirazjewelhouse_db_user:zyrCfjZ1wVDm2kdf@cluster0.dnlzvq8.mongodb.net/?appName=Cluster0";

const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const CategorySchema = new mongoose.Schema({}, { strict: false });
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

async function getProducts() {
  await mongoose.connect(MONGODB_URI);
  
  const productSlugs = [
    'apex-stackable-double-row-diamond-ring',
    'signature-minimal-piece',
  ];
  
  const products = await Product.find({
    $or: [
      { slug: { $in: productSlugs } },
      { category: { $in: ['chains', 'bracelets', 'rings'] } }
    ]
  }).lean();
  
  const categoryMap = {};
  const categories = await Category.find({}).lean();
  categories.forEach(cat => categoryMap[cat.slug || cat.name?.toLowerCase()] = cat);
  
  console.log(JSON.stringify(products.map(p => ({
    name: p.name,
    slug: p.slug,
    category: p.category,
    baseWeight: p.baseWeight,
    diamondWeightCarats: p.diamondWeightCarats,
    jewelryType: p.jewelryType,
    stoneType: p.stoneType,
    makingCharges: p.makingCharges,
    pricingOverrides: p.pricingOverrides,
    categoryConfig: categoryMap[p.category],
    categoryOverrides: p.categoryOverrides,
    specs: p.specs,
  })), null, 2));
  
  await mongoose.disconnect();
}

getProducts();
