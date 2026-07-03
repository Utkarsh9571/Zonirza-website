
const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://zonirazjewelhouse_db_user:zyrCfjZ1wVDm2kdf@cluster0.dnlzvq8.mongodb.net/?appName=Cluster0";

const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const CategorySchema = new mongoose.Schema({}, { strict: false });
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

async function getDetailedData() {
  await mongoose.connect(MONGODB_URI);
  
  const slugs = [
    'apex-stackable-double-row-diamond-ring',
    'signature-minimal-piece-1782300805766',
    'royal-gold-rope-chain-demo',
    'starlight-diamond-tennis-bracelet-demo',
    'ruby-floral-accent-bangle-demo'
  ];
  
  const products = await Product.find({ slug: { $in: slugs } }).lean();
  
  const categoryMap = {};
  const categories = await Category.find({}).lean();
  categories.forEach(cat => categoryMap[cat.slug || cat.name?.toLowerCase()] = cat);
  
  products.forEach(p => {
    console.log("\n" + "=".repeat(100));
    console.log(p.name.toUpperCase());
    console.log("=".repeat(100));
    console.log("\n--- Raw DB Fields ---");
    console.log("baseWeight:", p.baseWeight);
    console.log("diamondWeightCarats:", p.diamondWeightCarats);
    console.log("jewelryType:", p.jewelryType);
    console.log("stoneType:", p.stoneType);
    console.log("makingCharges:", p.makingCharges);
    console.log("pricingOverrides:", JSON.stringify(p.pricingOverrides, null, 2));
    console.log("categoryConfig.makingCharges:", categoryMap[p.category]?.config?.makingCharges);
  });
  
  await mongoose.disconnect();
}

getDetailedData();
