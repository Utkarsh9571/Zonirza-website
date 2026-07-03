const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.*)/);
    if (match && match[1]) {
      MONGODB_URI = match[1].trim();
    }
  }
}

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const categoryImageMap = {
  'diamond': 'default-1599561271.png',
  'solitaire': 'default-1599561716.png',
  'gemstone': 'rose-gold-16017058152140.jpg',
  'plain_gold': 'yellow-gold-15998912192702.jpg',
  'studs-earrings': 'default-1634564005270.jpg',
  'diamond-rings': 'default-16345643111839.jpg',
  'zodiac-pendants': 'default-16345646283660.jpg',
  'couple-brands': 'default-16345651242469.jpg',
  'plain-gold': 'yellow-gold-15998915781385.jpg',
  'office-wear': 'rose-gold-16017061711838.jpg',
  'stackable': 'default-16345653303643.jpg',
  'cocktail': 'rose-gold-16017065661069.jpg',
  'religious': 'default-16345655171961.jpg',
  'engagement-rings': 'default-16345657931455.jpg',
  'navaratna-rings': 'default-16345662961870.jpg',
  'pearl-rings': 'default-16345665363270.jpg',
  'for-men-rings': 'yellow-gold-1599892080178.jpg',
  'drops-earrings': 'rose-gold-16017069551952.jpg',
  'jhumkas-earrings': 'default-16349699141186.jpg',
  'bangles-bangles': 'yellow-gold-15998922871609.jpg'
};

async function updateCategoryImages() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.');

    const categories = await Category.find({});
    console.log(`Found ${categories.length} categories.`);

    let updatedCount = 0;
    for (const category of categories) {
      if (categoryImageMap[category.slug]) {
        category.image = categoryImageMap[category.slug];
        await category.save();
        console.log(`Updated ${category.slug} with ${category.image}`);
        updatedCount++;
      } else if (category.image.startsWith('http')) {
        // Fallback for others that still have Unsplash URLs
        const randomDefault = `default-16349706321515.jpg`; 
        category.image = randomDefault;
        await category.save();
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} category images.`);
    process.exit(0);
  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
}

updateCategoryImages();
