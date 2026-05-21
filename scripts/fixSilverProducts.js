const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  if (line && line.includes('=')) {
    const [key, ...value] = line.split('=');
    envVars[key.trim()] = value.join('=').trim();
  }
});

const MONGODB_URI = envVars.MONGODB_URI;

async function migrate() {
  console.log('--- Starting Silver Products Migration ---');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to Database.');

  const db = mongoose.connection.db;
  const productsCol = db.collection('products');
  
  const products = await productsCol.find({}).toArray();
  console.log(`Found ${products.length} total products.`);

  let updatedCount = 0;
  let skippedCount = 0;
  const report = {
    total: products.length,
    updated: 0,
    metalCounts: {
      'silver': 0,
      'yellow-gold': 0,
      'rose-gold': 0,
      'white-gold': 0,
      'platinum': 0,
      'unknown': 0
    },
    missingSilverTagsAdded: 0,
    namesEnhanced: 0,
    errors: []
  };

  for (const product of products) {
    let primaryMetal = 'unknown';

    // 1. Detect metal based on explicit existing specs or configurableOptions
    const specMetal = product.specs?.metal?.toLowerCase() || '';
    const configMetals = product.configurableOptions?.metals || [];
    const tags = product.tags || [];
    const slug = product.slug?.toLowerCase() || '';
    const name = product.name?.toLowerCase() || '';

    // Check configMetals first as it's from normalization
    if (configMetals.includes('silver') || specMetal === 'silver' || slug.endsWith('-silver') || slug.includes('silver') || tags.includes('silver') || configMetals.includes('default') || specMetal === 'default') {
      primaryMetal = 'silver';
    } else if (configMetals.includes('rose-gold') || specMetal.includes('rose') || slug.endsWith('-rose-gold') || tags.includes('rose gold') || tags.includes('rose-gold')) {
      primaryMetal = 'rose-gold';
    } else if (configMetals.includes('yellow-gold') || specMetal.includes('yellow') || slug.endsWith('-yellow-gold') || (specMetal.includes('gold') && !specMetal.includes('rose') && !specMetal.includes('white'))) {
      primaryMetal = 'yellow-gold';
    } else if (configMetals.includes('white-gold') || specMetal.includes('white')) {
      primaryMetal = 'white-gold';
    } else if (configMetals.includes('platinum') || specMetal.includes('platinum')) {
      primaryMetal = 'platinum';
    } else {
      // Fallback heuristics: if it's just 'gold' we usually assume yellow-gold
      if (tags.includes('gold') || name.includes('gold')) {
        if (name.includes('rose')) primaryMetal = 'rose-gold';
        else if (name.includes('white')) primaryMetal = 'white-gold';
        else primaryMetal = 'yellow-gold';
      } else if (tags.includes('925') || name.includes('925') || product.description?.toLowerCase().includes('925') || product.description?.toLowerCase().includes('silver')) {
        primaryMetal = 'silver';
      }
    }

    report.metalCounts[primaryMetal] = (report.metalCounts[primaryMetal] || 0) + 1;

    let needsUpdate = false;
    const updateDocs = { $set: {}, $addToSet: {} };

    // Set primaryMetal
    if (product.primaryMetal !== primaryMetal && primaryMetal !== 'unknown') {
      updateDocs.$set.primaryMetal = primaryMetal;
      needsUpdate = true;
    } else if (!product.primaryMetal && primaryMetal === 'unknown') {
        // even if unknown, set it to avoid nulls later maybe, but let's skip
    }

    // Enhance Silver Metadata
    if (primaryMetal === 'silver') {
      if (!tags.includes('silver')) {
        updateDocs.$addToSet.tags = 'silver';
        report.missingSilverTagsAdded++;
        needsUpdate = true;
      }
      
      // Optional Safe Name Enhancement
      // Only if it doesn't contain silver and is a variant (slug ends with -silver, or default) or is clearly just a silver product
      if (!name.includes('silver') && (slug.endsWith('-silver') || configMetals.includes('default') || product.images.some(i => i.toLowerCase().includes('silver') || i.toLowerCase().startsWith('default-')))) {
        // e.g., "Kina Arnett Ring" -> "Kina Arnett Ring - Silver"
        // Also remove "gold" from the name if it's there? The user said "safely enhance", but didn't mention removing gold.
        if (!product.name.includes(' - Silver')) {
            const newName = `${product.name} - Silver`;
            updateDocs.$set.name = newName;
            report.namesEnhanced++;
            needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      try {
        if (Object.keys(updateDocs.$set).length === 0) delete updateDocs.$set;
        if (Object.keys(updateDocs.$addToSet).length === 0) delete updateDocs.$addToSet;

        await productsCol.updateOne({ _id: product._id }, updateDocs);
        report.updated++;
      } catch (err) {
        report.errors.push(`Failed to update ${product.slug}: ${err.message}`);
      }
    }
  }

  console.log('Migration Complete.');
  console.log(`Updated: ${report.updated} products`);
  console.log(`Missing Silver Tags Added: ${report.missingSilverTagsAdded}`);
  console.log(`Names Enhanced: ${report.namesEnhanced}`);
  console.log('Metal Counts:', JSON.stringify(report.metalCounts, null, 2));

  fs.writeFileSync(path.join(__dirname, '../silver_migration_report.json'), JSON.stringify(report, null, 2));
  
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
