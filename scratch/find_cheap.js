const mongoose = require('mongoose');

async function run() {
  const conn = await mongoose.createConnection('mongodb+srv://zonirazjewelhouse_db_user:zyrCfjZ1wVDm2kdf@cluster0.dnlzvq8.mongodb.net/test?appName=Cluster0').asPromise();
  const products = await conn.db.collection('products').find({ basePrice: { $lt: 5000 } }).toArray();
  
  console.log('Cheap Products Count:', products.length);
  if (products.length > 0) {
    console.log(JSON.stringify(products[0], null, 2));
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
