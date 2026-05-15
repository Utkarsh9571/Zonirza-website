const mongoose = require('mongoose');

async function run() {
  const conn = await mongoose.createConnection('mongodb+srv://zonirazjewelhouse_db_user:zyrCfjZ1wVDm2kdf@cluster0.dnlzvq8.mongodb.net/test?appName=Cluster0').asPromise();
  const products = await conn.db.collection('products').find({}).toArray();
  
  const metalsSet = new Set();
  const specMetalsSet = new Set();

  products.forEach(p => {
    if (p.configurableOptions && p.configurableOptions.metals) {
      p.configurableOptions.metals.forEach(m => metalsSet.add(m));
    }
    if (p.specs && p.specs.metal) {
      p.specs.metal.split(',').forEach(m => specMetalsSet.add(m.trim()));
    }
  });

  console.log('All Configurable Metals:', Array.from(metalsSet));
  console.log('All Spec Metals:', Array.from(specMetalsSet));

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
