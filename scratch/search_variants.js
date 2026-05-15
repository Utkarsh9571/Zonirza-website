const mongoose = require('mongoose');

async function run() {
  const conn = await mongoose.createConnection('mongodb+srv://zonirazjewelhouse_db_user:zyrCfjZ1wVDm2kdf@cluster0.dnlzvq8.mongodb.net/test?appName=Cluster0').asPromise();
  const products = await conn.db.collection('products').find({}).toArray();
  
  const matches = products.filter(p => JSON.stringify(p).includes('925'));
  console.log('Matches for 925:', matches.length);
  if (matches.length > 0) {
    console.log(JSON.stringify(matches[0], null, 2));
  }

  const whiteGoldMatches = products.filter(p => JSON.stringify(p).toLowerCase().includes('white-gold'));
  console.log('Matches for white-gold:', whiteGoldMatches.length);
  if (whiteGoldMatches.length > 0) {
    console.log(JSON.stringify(whiteGoldMatches[0], null, 2));
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
