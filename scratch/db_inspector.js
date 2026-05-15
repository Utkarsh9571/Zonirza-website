const mongoose = require('mongoose');
const Schema = mongoose.Schema;

async function run() {
  await mongoose.connect('mongodb+srv://zonirazjewelhouse_db_user:zyrCfjZ1wVDm2kdf@cluster0.dnlzvq8.mongodb.net/test?appName=Cluster0');
  const Product = mongoose.model('Product', new Schema({}, { collection: 'products', strict: false }));

  const products = await Product.find({}).limit(10);
  console.log(JSON.stringify(products, null, 2));

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
