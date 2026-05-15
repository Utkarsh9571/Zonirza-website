const mongoose = require('mongoose');

async function run() {
  const conn = await mongoose.createConnection('mongodb+srv://zonirazjewelhouse_db_user:zyrCfjZ1wVDm2kdf@cluster0.dnlzvq8.mongodb.net/test?appName=Cluster0').asPromise();
  const products = await conn.db.collection('products').find({}).limit(50).toArray();
  
  products.forEach(p => {
    console.log(`Product: ${p.name}`);
    console.log(`Images: ${p.images.slice(0, 3)}...`);
  });

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
