const mongoose = require('mongoose');
const Schema = mongoose.Schema;

async function run() {
  await mongoose.connect('mongodb+srv://zonirazjewelhouse_db_user:zyrCfjZ1wVDm2kdf@cluster0.dnlzvq8.mongodb.net/test?appName=Cluster0');
  const Product = mongoose.model('Product', new Schema({ 
    name: String, 
    specs: Object, 
    configurableOptions: Object,
    tags: [String],
    category: String,
    images: [String]
  }, { collection: 'products' }));

  const silverProducts = await Product.find({
    $or: [
      { 'configurableOptions.metals': /silver/i },
      { 'specs.metal': /silver/i },
      { 'specs.Metal': /silver/i },
      { tags: /silver/i },
      { category: /silver/i }
    ]
  });

  console.log('Total Silver Products Found:', silverProducts.length);
  if (silverProducts.length > 0) {
    console.log('--- Sample Silver Product ---');
    console.log(JSON.stringify(silverProducts[0], null, 2));
    
    // Check their image names
    console.log('--- Image Names for Sample ---');
    console.log(silverProducts[0].images);
  }

  // Also check "white-gold" vs "silver"
  const whiteGoldProducts = await Product.find({
    $or: [
      { 'configurableOptions.metals': /white-gold/i },
      { 'specs.metal': /white-gold/i }
    ]
  });
  console.log('Total White Gold Products Found:', whiteGoldProducts.length);

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
