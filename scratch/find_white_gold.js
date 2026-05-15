const mongoose = require('mongoose');
const Schema = mongoose.Schema;

async function run() {
  await mongoose.connect('mongodb+srv://zonirazjewelhouse_db_user:zyrCfjZ1wVDm2kdf@cluster0.dnlzvq8.mongodb.net/test?appName=Cluster0');
  const Product = mongoose.model('Product', new Schema({}, { collection: 'products', strict: false }));

  const products = await Product.find({
    $or: [
      { images: /white-gold/i },
      { 'configurableOptions.metals': /white-gold/i },
      { 'specs.metal': /white-gold/i }
    ]
  });

  console.log('White Gold Products:', products.length);
  if (products.length > 0) {
    console.log(JSON.stringify(products[0], null, 2));
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
