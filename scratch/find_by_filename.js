const mongoose = require('mongoose');
const Schema = mongoose.Schema;

async function run() {
  await mongoose.connect('mongodb+srv://zonirazjewelhouse_db_user:zyrCfjZ1wVDm2kdf@cluster0.dnlzvq8.mongodb.net/test?appName=Cluster0');
  const Product = mongoose.model('Product', new Schema({}, { collection: 'products', strict: false }));

  const filename = "white-gold-16439576841380.jpg";
  const p = await Product.findOne({ images: filename });
  
  if (p) {
    console.log('Found Product:');
    console.log(JSON.stringify(p, null, 2));
  } else {
    console.log('Product not found for filename:', filename);
    // Try partial match
    const p2 = await Product.findOne({ images: /16439576841380/ });
    if (p2) console.log('Found by partial match:', p2.name);
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
