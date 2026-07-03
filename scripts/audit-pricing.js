
const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://zonirazjewelhouse_db_user:zyrCfjZ1wVDm2kdf@cluster0.dnlzvq8.mongodb.net/?appName=Cluster0';

async function auditProduct() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    
    console.log('🔍 Searching for "Apex Stackable Double Row Diamond Ring"...');
    const product = await db.collection('products').findOne({ 
      name: { $regex: /Apex Stackable Double Row Diamond Ring/i } 
    });

    if (!product) {
      console.log('❌ Product not found!');
      await mongoose.disconnect();
      return;
    }

    console.log('\n✅ Raw MongoDB Document (sanitized for clarity):');
    console.log(JSON.stringify({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      basePrice: product.basePrice,
      makingCharges: product.makingCharges,
      pricingOverrides: product.pricingOverrides,
      categoryOverrides: product.categoryOverrides,
      categoryConfig: product.categoryConfig,
      configurableOptions: product.configurableOptions,
      defaultMetal: product.defaultMetal,
      defaultPurity: product.defaultPurity,
      defaultDiamondQuality: product.defaultDiamondQuality,
      estimatedWeight: product.estimatedWeight,
      diamondWeight: product.diamondWeight,
      price: product.price,
      specs: product.specs,
      tags: product.tags
    }, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

auditProduct();
