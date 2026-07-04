const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

/**
 * Luxury Jewelry Production-Grade Variant Pipeline
 * 1. Maps metal variants to specific images in MongoDB.
 * 2. Extracts ONLY Silver/Default variants for visual editing.
 * 3. Preserves original filenames for database compatibility.
 */

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/jewelry-starter";
const IMAGE_DIR = path.join(__dirname, '../public/images/images/product');
const EXPORT_DIR = path.join(__dirname, '../exports/silver-products');

const ProductSchema = new mongoose.Schema({
  name: String,
  slug: String,
  images: [String],
  tags: [String],
  category: String,
  specs: mongoose.Schema.Types.Mixed,
  configurableOptions: mongoose.Schema.Types.Mixed,
  variantImages: { type: Map, of: String, default: {} }
}, { collection: 'products' });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function run() {
  console.log('--- Starting Intelligent Variant Pipeline ---');
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }

  const allProducts = await Product.find({});
  console.log(`Analyzing ${allProducts.length} products...`);

  if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
  }

  const stats = {
    totalProcessed: 0,
    totalMapped: 0,
    totalExported: 0,
    silverProducts: []
  };

  for (const product of allProducts) {
    const variantMap = {};
    const metals = product.configurableOptions?.metals || [];
    const specMetal = product.specs?.metal || '';
    
    // Identify if this product has silver/white-gold/platinum variants
    const silverKeywords = ['default', 'white-gold', 'platinum', 'silver'];
    const hasSilverVariant = metals.some(m => silverKeywords.includes(m.toLowerCase())) ||
                            silverKeywords.some(k => specMetal.toLowerCase().includes(k));

    // Mapping Logic: Scan images for variant prefixes
    // We prioritize product shots (non-gifs) for thumbnails if possible, but keep original if not.
    for (const img of product.images) {
      const lowerImg = img.toLowerCase();
      const isGif = lowerImg.endsWith('.gif');
      
      // Map based on filename prefixes
      if (lowerImg.startsWith('yellow-gold-') && !variantMap['yellow-gold']) {
        variantMap['yellow-gold'] = img;
      } else if (lowerImg.startsWith('rose-gold-') && !variantMap['rose-gold']) {
        variantMap['rose-gold'] = img;
      } else if (lowerImg.startsWith('white-gold-') && !variantMap['white-gold']) {
        variantMap['white-gold'] = img;
      } else if (lowerImg.startsWith('platinum-') && !variantMap['platinum']) {
        variantMap['platinum'] = img;
      } else if (lowerImg.startsWith('default-') && !variantMap['default']) {
        variantMap['default'] = img;
      } else if (lowerImg.startsWith('silver-') && !variantMap['silver']) {
        variantMap['silver'] = img;
      }
    }

    // Update DB with the new variant map
    if (Object.keys(variantMap).length > 0) {
      await Product.updateOne({ _id: product._id }, { $set: { variantImages: variantMap } });
      stats.totalMapped++;
    }

    // Export Logic: ONLY for silver-capable products
    if (hasSilverVariant) {
      const productDir = path.join(EXPORT_DIR, product.slug);
      let copiedCount = 0;

      for (const img of product.images) {
        const lowerImg = img.toLowerCase();
        // We only export the "silver-looking" variants for editing
        if (lowerImg.startsWith('default-') || lowerImg.startsWith('white-gold-') || lowerImg.startsWith('platinum-') || lowerImg.startsWith('silver-')) {
          const src = path.join(IMAGE_DIR, img);
          const dest = path.join(productDir, img);
          
          if (fs.existsSync(src)) {
            if (!fs.existsSync(productDir)) fs.mkdirSync(productDir, { recursive: true });
            fs.copyFileSync(src, dest);
            copiedCount++;
          }
        }
      }

      if (copiedCount > 0) {
        stats.totalExported++;
        stats.silverProducts.push({
          name: product.name,
          slug: product.slug,
          images: copiedCount
        });
      }
    }

    stats.totalProcessed++;
    if (stats.totalProcessed % 100 === 0) console.log(`Processed ${stats.totalProcessed} products...`);
  }

  const reportPath = path.join(__dirname, '../exports/variant_report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      totalAnalyzed: stats.totalProcessed,
      totalMappedInDB: stats.totalMapped,
      totalSilverProductsExported: stats.totalExported
    },
    exportedProducts: stats.silverProducts
  }, null, 2));

  console.log('\n--- Variant Pipeline Results ---');
  console.log(`Mapped Variants:     ${stats.totalMapped}`);
  console.log(`Exported Silver:     ${stats.totalExported}`);
  console.log(`Detailed Report:     ${reportPath}`);
  
  process.exit(0);
}

run().catch(err => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});
