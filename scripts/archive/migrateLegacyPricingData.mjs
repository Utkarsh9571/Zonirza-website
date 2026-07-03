
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  console.error("MONGODB_URI not set in .env.local!");
  process.exit(1);
}

const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

function parseWeight(weightStr: string): number {
  if (!weightStr) return 0;
  const cleaned = weightStr.toLowerCase().replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

async function migrateLegacyPricingData() {
  console.log("⏳ Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB!");

  const products = await Product.find({});
  console.log(`📦 Found ${products.length} products!`);

  let migratedCount = 0;
  let baseWeightAddedCount = 0;
  let diamondWeightCaratsAddedCount = 0;
  let jewelryTypeSetCount = 0;
  let stoneTypeSetCount = 0;

  for (const product of products) {
    const updateFields: Record<string, any> = {};
    const specs = product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs || {};

    // Step 1: Extract baseWeight from specs["Gold Weight"] or specs["Weight"]
    const goldWeight = specs["Gold Weight"] || specs["Weight"];
    const parsedGoldWeight = parseWeight(goldWeight);
    if (parsedGoldWeight > 0 && !product.baseWeight) {
      updateFields.baseWeight = parsedGoldWeight;
      baseWeightAddedCount++;
    }

    // Step 2: Extract diamondWeightCarats from specs["Diamond Weight"]
    const diamondWeight = specs["Diamond Weight"];
    const parsedDiamondWeight = parseWeight(diamondWeight);
    if (parsedDiamondWeight > 0) {
      updateFields.diamondWeightCarats = parsedDiamondWeight;
      diamondWeightCaratsAddedCount++;
    }

    // Step 3: Infer jewelryType and stoneType
    let jewelryType: "gold" | "diamond" | "gemstone" = "gold";
    let stoneType: string | undefined = undefined;

    const productName = (product.name || "").toLowerCase();
    const productTags = (product.tags || []).map((t: string) => t.toLowerCase());
    const configStones = (product.configurableOptions?.stones || []).map((s: string) => s.toLowerCase());

    // Check for diamond
    if (
      parsedDiamondWeight > 0 ||
      productName.includes("diamond") ||
      productTags.includes("diamond") ||
      configStones.length > 0 ||
      product.hasDiamond
    ) {
      jewelryType = "diamond";
      stoneType = "diamond";
    } else {
      // Check for other gemstones
      const gemstoneTypes = ["ruby", "emerald", "sapphire", "moissanite", "cz", "zircon"];
      for (const gt of gemstoneTypes) {
        if (
          productName.includes(gt) ||
          productTags.includes(gt) ||
          configStones.some((s: string) => s.includes(gt))
        ) {
          jewelryType = "gemstone";
          stoneType = gt;
          break;
        }
      }
    }

    if (jewelryType !== product.jewelryType) {
      updateFields.jewelryType = jewelryType;
      jewelryTypeSetCount++;
    }

    if (stoneType && stoneType !== product.stoneType) {
      updateFields.stoneType = stoneType;
      stoneTypeSetCount++;
    }

    if (Object.keys(updateFields).length > 0) {
      await Product.updateOne({ _id: product._id }, { $set: updateFields });
      migratedCount++;
      console.log(`Updated product ${product.slug} with:`, updateFields);
    }
  }

  console.log("\n✅ MIGRATION REPORT:");
  console.log(`Total products processed: ${products.length}`);
  console.log(`Total products updated: ${migratedCount}`);
  console.log(`baseWeight added: ${baseWeightAddedCount}`);
  console.log(`diamondWeightCarats added: ${diamondWeightCaratsAddedCount}`);
  console.log(`jewelryType set: ${jewelryTypeSetCount}`);
  console.log(`stoneType set: ${stoneTypeSetCount}`);

  await mongoose.disconnect();
  console.log("\n🔌 Disconnected from MongoDB!");
  process.exit(0);
}

migrateLegacyPricingData().catch(console.error);
