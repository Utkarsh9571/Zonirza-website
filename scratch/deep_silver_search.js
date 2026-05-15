const mongoose = require('mongoose');
const Schema = mongoose.Schema;

async function run() {
  await mongoose.connect('mongodb+srv://zonirazjewelhouse_db_user:zyrCfjZ1wVDm2kdf@cluster0.dnlzvq8.mongodb.net/test?appName=Cluster0');
  const Product = mongoose.model('Product', new Schema({}, { collection: 'products', strict: false }));

  const allProducts = await Product.find({});
  let silverCount = 0;
  let silverExamples = [];

  for (const p of allProducts) {
    const pStr = JSON.stringify(p).toLowerCase();
    if (pStr.includes('silver')) {
      silverCount++;
      if (silverExamples.length < 5) silverExamples.push(p);
    }
  }

  console.log('Total Products with "silver" anywhere:', silverCount);
  if (silverExamples.length > 0) {
    console.log('--- Silver Example ---');
    console.log(JSON.stringify(silverExamples[0], null, 2));
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
