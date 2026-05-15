const mongoose = require('mongoose');

async function run() {
  const conn = await mongoose.createConnection('mongodb+srv://zonirazjewelhouse_db_user:zyrCfjZ1wVDm2kdf@cluster0.dnlzvq8.mongodb.net/test?appName=Cluster0').asPromise();
  const collections = await conn.db.listCollections().toArray();
  console.log(collections.map(c => c.name));
  
  const products = await conn.db.collection('products').countDocuments();
  console.log('Product Count in test:', products);

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
