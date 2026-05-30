const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// 1. Read env variables
const envPath = path.join(__dirname, '..', '.env.local');
let mongodbUri = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/MONGODB_URI\s*=\s*(.*)/);
  if (match) {
    mongodbUri = match[1].trim().replace(/['"]/g, '');
  }
}

if (!mongodbUri) {
  const fallbackEnvPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(fallbackEnvPath)) {
    const envContent = fs.readFileSync(fallbackEnvPath, 'utf8');
    const match = envContent.match(/MONGODB_URI\s*=\s*(.*)/);
    if (match) {
      mongodbUri = match[1].trim().replace(/['"]/g, '');
    }
  }
}

if (!mongodbUri) {
  console.error("Error: MONGODB_URI not found in env files.");
  process.exit(1);
}

// Define the Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  slug: String,
  category: String,
  description: String,
  isActive: Boolean,
  tags: [String],
  specs: { type: Map, of: String, default: {} }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function run() {
  console.log("Connecting to database...");
  await mongoose.connect(mongodbUri);
  console.log("Connected to MongoDB.");

  const products = await Product.find({ isActive: { $ne: false } });
  console.log(`Auditing ${products.length} active products...`);

  const report = [];
  let updatedCount = 0;

  for (const product of products) {
    const nameLower = (product.name || '').toLowerCase();
    const descLower = (product.description || '').toLowerCase();
    const currentCategory = product.category || '';
    const currentCategoryLower = currentCategory.toLowerCase();

    let updated = false;
    const inferences = {};

    // 1. Category Inference & Normalization
    let targetCategory = '';
    let categoryConfidence = 'None';

    // Heuristics for category: EARRINGS check must be first since it contains the substring "ring"
    if (
      nameLower.includes('earring') || 
      nameLower.includes('stud') || 
      nameLower.includes('dangler') || 
      nameLower.includes('drop') || 
      nameLower.includes('jhumka') || 
      nameLower.includes('cuff') || 
      nameLower.includes('hoop') ||
      currentCategoryLower.includes('earring') || 
      currentCategoryLower.includes('studs') ||
      currentCategoryLower.includes('drops') ||
      currentCategoryLower.includes('danglers')
    ) {
      targetCategory = 'earrings';
      categoryConfidence = 'High';
    } else if (nameLower.includes('ring') || currentCategoryLower === 'ring' || currentCategoryLower.includes('ring')) {
      targetCategory = 'rings';
      categoryConfidence = 'High';
    } else if (
      nameLower.includes('pendant') || 
      nameLower.includes('locket') || 
      currentCategoryLower.includes('pendant') ||
      currentCategoryLower.includes('initial') ||
      currentCategoryLower.includes('zodiac') ||
      currentCategoryLower.includes('jersey')
    ) {
      targetCategory = 'pendants';
      categoryConfidence = 'High';
    } else if (nameLower.includes('nose pin') || nameLower.includes('nosepin') || nameLower.includes('nose-pin') || currentCategoryLower.includes('nose pin')) {
      targetCategory = 'nose-pin';
      categoryConfidence = 'High';
    } else if (nameLower.includes('bangle') || nameLower.includes('kada') || currentCategoryLower.includes('bangle')) {
      targetCategory = 'bangles';
      categoryConfidence = 'High';
    } else if (nameLower.includes('necklace') || nameLower.includes('choker') || nameLower.includes('haram') || currentCategoryLower.includes('necklace')) {
      targetCategory = 'necklaces';
      categoryConfidence = 'High';
    } else if (nameLower.includes('bracelet') || currentCategoryLower.includes('bracelet')) {
      targetCategory = 'bracelets';
      categoryConfidence = 'High';
    } else if (nameLower.includes('chain') || currentCategoryLower.includes('chain')) {
      targetCategory = 'chains';
      categoryConfidence = 'High';
    }

    // Only update category if it's generic/missing or we have high confidence normalization
    const genericCategories = [
      'diamond', 'studs', 'for men', 'color stone', 'nose pins', 'ring',
      'for gift', 'initial', 'drops', 'danglers', 'religious', 'love & heart',
      'for kids', 'couple bands', 'zodiac', 'office wear', 'cocktail',
      'jersey number', 'love & heart  ring', 'colour stone ring', 'cluster studs',
      'hoops earrings', 'solitaire', 'test1', 'colour stone pendent'
    ];

    const isGeneric = genericCategories.includes(currentCategoryLower) || !currentCategory;

    if (targetCategory && (isGeneric || currentCategoryLower !== targetCategory)) {
      inferences.category = { from: currentCategory, to: targetCategory, confidence: categoryConfidence };
      product.category = targetCategory;
      updated = true;

      // Ensure base category is in tags
      const singularCat = targetCategory.endsWith('s') ? targetCategory.slice(0, -1) : targetCategory;
      if (!product.tags.includes(targetCategory)) product.tags.push(targetCategory);
      if (!product.tags.includes(singularCat)) product.tags.push(singularCat);
    }

    // 2. Stone Specs Inference
    let currentStone = product.specs.get('stone') || '';
    if (!currentStone) {
      let inferredStone = '';
      let stoneConfidence = 'None';

      if (nameLower.includes('diamond')) {
        inferredStone = 'diamond';
        stoneConfidence = 'High';
      } else if (nameLower.includes('emerald')) {
        inferredStone = 'emerald';
        stoneConfidence = 'High';
      } else if (nameLower.includes('ruby')) {
        inferredStone = 'ruby';
        stoneConfidence = 'High';
      } else if (nameLower.includes('sapphire')) {
        inferredStone = 'sapphire';
        stoneConfidence = 'High';
      } else if (nameLower.includes('pearl')) {
        inferredStone = 'pearl';
        stoneConfidence = 'High';
      }

      if (inferredStone) {
        inferences.stone = { from: '', to: inferredStone, confidence: stoneConfidence };
        product.specs.set('stone', inferredStone);
        updated = true;

        if (!product.tags.includes(inferredStone)) product.tags.push(inferredStone);
        if (['emerald', 'ruby', 'sapphire', 'pearl'].includes(inferredStone) && !product.tags.includes('gemstone')) {
          product.tags.push('gemstone');
        }
      }
    }

    // 3. Metal Specs Inference
    let currentMetal = product.specs.get('metal') || '';
    if (!currentMetal) {
      let inferredMetal = '';
      let metalConfidence = 'None';

      if (nameLower.includes('yellow-gold') || nameLower.includes('yellow gold')) {
        inferredMetal = 'yellow-gold';
        metalConfidence = 'High';
      } else if (nameLower.includes('rose-gold') || nameLower.includes('rose gold')) {
        inferredMetal = 'rose-gold';
        metalConfidence = 'High';
      } else if (nameLower.includes('white-gold') || nameLower.includes('white gold')) {
        inferredMetal = 'white-gold';
        metalConfidence = 'High';
      } else if (nameLower.includes('platinum')) {
        inferredMetal = 'platinum';
        metalConfidence = 'High';
      } else {
        // Fallback: default gold based on image names
        if (product.images && product.images.length > 0) {
          const firstImage = product.images[0].toLowerCase();
          if (firstImage.includes('yellow')) {
            inferredMetal = 'yellow-gold';
            metalConfidence = 'Medium';
          } else if (firstImage.includes('rose')) {
            inferredMetal = 'rose-gold';
            metalConfidence = 'Medium';
          } else if (firstImage.includes('white')) {
            inferredMetal = 'white-gold';
            metalConfidence = 'Medium';
          }
        }
      }

      if (inferredMetal) {
        inferences.metal = { from: '', to: inferredMetal, confidence: metalConfidence };
        product.specs.set('metal', inferredMetal);
        updated = true;

        if (!product.tags.includes('gold') && inferredMetal.includes('gold')) {
          product.tags.push('gold');
        }
      }
    }

    // 4. Style Specs Inference
    let currentStyle = product.specs.get('style') || '';
    if (!currentStyle) {
      let inferredStyle = '';
      let styleConfidence = 'None';

      if (nameLower.includes('stud') || currentCategoryLower.includes('stud')) {
        inferredStyle = 'studs';
        styleConfidence = 'High';
      } else if (nameLower.includes('jhumka') || currentCategoryLower.includes('jhumka')) {
        inferredStyle = 'jhumka';
        styleConfidence = 'High';
      } else if (nameLower.includes('hoop') || currentCategoryLower.includes('hoops')) {
        inferredStyle = 'hoops';
        styleConfidence = 'High';
      } else if (nameLower.includes('drop') || currentCategoryLower.includes('drops')) {
        inferredStyle = 'drops';
        styleConfidence = 'High';
      } else if (nameLower.includes('dangler') || currentCategoryLower.includes('danglers')) {
        inferredStyle = 'danglers';
        styleConfidence = 'High';
      } else if (nameLower.includes('solitaire') || currentCategoryLower.includes('solitaire')) {
        inferredStyle = 'solitaire';
        styleConfidence = 'High';
      } else if (nameLower.includes('cocktail') || currentCategoryLower.includes('cocktail')) {
        inferredStyle = 'cocktail';
        styleConfidence = 'High';
      } else if (nameLower.includes('engagement') || currentCategoryLower.includes('engagement')) {
        inferredStyle = 'engagement';
        styleConfidence = 'High';
      }

      if (inferredStyle) {
        inferences.style = { from: '', to: inferredStyle, confidence: styleConfidence };
        product.specs.set('style', inferredStyle);
        updated = true;
        
        if (!product.tags.includes(inferredStyle)) product.tags.push(inferredStyle);
      }
    }

    // 5. Gender Specs Inference
    let currentGender = product.specs.get('gender') || '';
    if (!currentGender) {
      let inferredGender = '';
      let genderConfidence = 'None';

      if (nameLower.includes('men') || nameLower.includes('guy') || currentCategoryLower.includes('men')) {
        inferredGender = 'men';
        genderConfidence = 'High';
      } else if (nameLower.includes('kids') || nameLower.includes('baby') || nameLower.includes('child') || currentCategoryLower.includes('kids')) {
        inferredGender = 'kids';
        genderConfidence = 'High';
      } else if (nameLower.includes('women') || nameLower.includes('girl') || nameLower.includes('lady') || currentCategoryLower.includes('women')) {
        inferredGender = 'women';
        genderConfidence = 'High';
      } else {
        inferredGender = 'women';
        genderConfidence = 'Medium';
      }

      if (inferredGender) {
        inferences.gender = { from: '', to: inferredGender, confidence: genderConfidence };
        product.specs.set('gender', inferredGender);
        updated = true;

        if (!product.tags.includes(inferredGender)) product.tags.push(inferredGender);
      }
    }

    if (updated) {
      updatedCount++;
      await product.save();
      report.push({
        product: product.name,
        slug: product.slug,
        inferences
      });
    }
  }

  console.log(`Enrichment complete. Updated ${updatedCount} products.`);
  
  // Write the report file
  const reportPath = path.join(__dirname, '..', 'taxonomy_recovery_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Enrichment report written to ${reportPath}`);

  await mongoose.disconnect();
  console.log("Database disconnected.");
  process.exit(0);
}

run().catch(err => {
  console.error("Error running migration:", err);
  process.exit(1);
});
