/**
 * Pricing V3 DB Migration & Seeding Script
 * 1. Updates Settings document: standardizes stonePrices -> diamondPrices, sets default gemstonePrices, and updates purityMultipliers.
 * 2. Migrates 63 diamond products with missing diamondWeightCarats by parsing specs.diamondWeight.
 * 3. Corrects gemstone products (e.g. Ruby Floral Accent Bangle) to jewelryType = stone and stoneType = ruby.
 * 4. Ensures all products have defaultMetal set.
 */

import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://zonirazjewelhouse_db_user:zyrCfjZ1wVDm2kdf@cluster0.dnlzvq8.mongodb.net/?appName=Cluster0';

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  let db = client.db('test');
  let count = await db.collection('products').countDocuments();
  if (count === 0) {
    db = client.db('zonirazjewelhouse');
    count = await db.collection('products').countDocuments();
  }

  console.log(`Connected to DB: "${db.databaseName}". Migrating...`);

  // 1. Migrate Settings Pricing Factors
  const settings = await db.collection('settings').findOne({});
  const defaultDiamondPrices = {
    'EF-VVS': 85000,
    'GH-VS': 65000,
    'GHI-VS': 55000,
    'FG-SI': 45000,
    'IJ-SI': 35000,
    'Diamond-Standard': 40000,
    'None': 0
  };
  const defaultGemstonePrices = {
    'ruby': 15000,
    'emerald': 18000,
    'sapphire': 20000,
    'moissanite': 8000,
    'cz': 1000,
    'default': 5000
  };
  const defaultPurityMultipliers = {
    '24K': 1.0,
    '22K': 0.916,
    '18K': 0.750,
    '14K': 0.585,
    '9K': 0.375
  };

  if (settings) {
    console.log('Found Settings document. Migrating pricingFactors...');
    const factors = settings.pricingFactors || {};
    
    // Move stonePrices -> diamondPrices if they exist and aren't already set
    const finalDiamondPrices = factors.diamondPrices || factors.stonePrices || defaultDiamondPrices;
    const finalGemstonePrices = factors.gemstonePrices || defaultGemstonePrices;
    const finalPurityMultipliers = factors.purityMultipliers || defaultPurityMultipliers;

    // Standardize naming in DB settings
    await db.collection('settings').updateOne(
      { _id: settings._id },
      {
        $set: {
          'pricingFactors.diamondPrices': finalDiamondPrices,
          'pricingFactors.gemstonePrices': finalGemstonePrices,
          'pricingFactors.purityMultipliers': finalPurityMultipliers,
        },
        $unset: {
          'pricingFactors.stonePrices': ''
        }
      }
    );
    console.log('Settings pricingFactors updated.');
  } else {
    console.log('No Settings document found. Creating a default settings document...');
    await db.collection('settings').insertOne({
      siteName: 'Zoniraz Jewelers',
      supportEmail: 'support@zoniraz.com',
      supportPhone: '+91 99999 99999',
      address: '123 Luxury Lane, Jewelry District',
      businessHours: 'Mon-Sat: 10AM - 8PM, Sun: Closed',
      footerText: 'Crafting brilliance for generations.',
      maintenanceMode: false,
      pricingFactors: {
        gstPercentage: 3,
        shippingBaseCharge: 0,
        freeShippingThreshold: 5000,
        metalRates: { gold24k: 6500, silver: 100, platinum: 4000 },
        diamondPrices: defaultDiamondPrices,
        gemstonePrices: defaultGemstonePrices,
        purityMultipliers: defaultPurityMultipliers,
        sizeWeightOffset: 0.15,
        ringsOffset: 0.12,
        chainsOffset: 0.25,
        braceletsOffset: 0.15,
        banglesOffset: 0.15
      },
      spinWinEnabled: true
    });
    console.log('Default settings created.');
  }

  // 2. Correct Ruby Floral Accent Bangle
  const bangleUpdate = await db.collection('products').updateOne(
    { name: /Ruby Floral Accent Bangle/i },
    {
      $set: {
        jewelryType: 'stone',
        stoneType: 'ruby',
        defaultMetal: 'yellow-gold'
      }
    }
  );
  if (bangleUpdate.modifiedCount > 0) {
    console.log('Corrected Ruby Floral Accent Bangle to jewelryType=stone, stoneType=ruby, defaultMetal=yellow-gold.');
  }

  // 3. Fix defaultMetal missing / platinum rates issues on gold jewelry
  const goldProducts = await db.collection('products').find({
    $or: [
      { defaultMetal: { $exists: false } },
      { defaultMetal: null },
      { defaultMetal: '' }
    ]
  }).toArray();
  for (const p of goldProducts) {
    await db.collection('products').updateOne({ _id: p._id }, { $set: { defaultMetal: 'yellow-gold' } });
  }
  console.log(`Ensured defaultMetal=yellow-gold on ${goldProducts.length} products.`);

  // Specifically fix Starlight Diamond Tennis Bracelet defaultMetal to yellow-gold
  await db.collection('products').updateOne(
    { name: /Starlight Diamond Tennis Bracelet/i },
    { $set: { defaultMetal: 'yellow-gold' } }
  );
  console.log('Updated Starlight Diamond Tennis Bracelet to defaultMetal=yellow-gold.');

  // 4. Migrate missing diamondWeightCarats on diamond products
  const diamondProducts = await db.collection('products').find({
    jewelryType: 'diamond',
    $or: [
      { diamondWeightCarats: { $exists: false } },
      { diamondWeightCarats: null },
      { diamondWeightCarats: 0 }
    ]
  }).toArray();

  console.log(`Processing ${diamondProducts.length} diamond products missing diamondWeightCarats...`);
  let fixedCount = 0;
  for (const p of diamondProducts) {
    // Attempt to extract from specs map
    const specsObj = p.specs || {};
    let extractedWeight = 0;
    
    // Check various common spec keys
    const rawWeight = specsObj.diamondWeight || specsObj.stoneWeight || specsObj['Diamond Weight'] || specsObj['stone-weight'] || '';
    if (rawWeight) {
      extractedWeight = parseFloat(String(rawWeight).replace(/[^\d.]/g, '')) || 0;
    }
    
    // If still 0, try to parse from product name
    if (extractedWeight === 0) {
      const match = p.name.match(/([\d.]+)\s*(?:ct|carat)/i);
      if (match) {
        extractedWeight = parseFloat(match[1]) || 0;
      }
    }
    
    // Default fallback if still 0
    if (extractedWeight === 0) {
      extractedWeight = 0.15; // standard fallback
    }

    await db.collection('products').updateOne(
      { _id: p._id },
      { $set: { diamondWeightCarats: extractedWeight } }
    );
    fixedCount++;
  }
  console.log(`Successfully migrated ${fixedCount} diamond products.`);

  await client.close();
  console.log('Migration finished successfully.');
}

main().catch(console.error);
