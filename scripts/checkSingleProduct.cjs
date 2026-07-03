
const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://zonirazjewelhouse_db_user:zyrCfjZ1wVDm2kdf@cluster0.dnlzvq8.mongodb.net/?appName=Cluster0";

const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function checkProduct() {
  await mongoose.connect(MONGODB_URI);
  const product = await Product.findOne({ slug: "apex-stackable-double-row-diamond-ring" });
  console.log("Product:", JSON.stringify(product, null, 2));
  await mongoose.disconnect();
}

checkProduct().catch(console.error);
