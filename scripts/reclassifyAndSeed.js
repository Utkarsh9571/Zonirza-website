const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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
  console.error("Error: MONGODB_URI not found in env files.");
  process.exit(1);
}

// 2. Define Schemas
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  images: { type: [String], required: true },
  videoUrl: { type: String },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true, default: 0 },
  makingCharges: { type: Number, default: 0 },
  baseWeight: { type: Number, default: 0 },
  stockStatus: { type: String, enum: ['in-stock', 'out-of-stock'], default: 'in-stock' },
  isActive: { type: Boolean, default: true },
  tags: { type: [String], default: [] },
  specs: { type: Map, of: String, default: {} },
  configurableOptions: {
    metals: [String],
    purities: [String],
    sizes: [String],
    stones: [String],
    customizations: [String]
  }
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const CORE_CATEGORIES = [
  { name: 'Rings', slug: 'rings', image: '/images/site/rings_category.png', description: 'Explore our exquisite collection of diamond and gold finger rings.' },
  { name: 'Earrings', slug: 'earrings', image: '/images/site/earrings_category.png', description: 'Beautiful gold, diamond, and gemstone earrings for every look.' },
  { name: 'Necklaces', slug: 'necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800', description: 'Stunning luxury chokers and statement necklaces.' },
  { name: 'Chains', slug: 'chains', image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800', description: 'Classic gold, silver, and platinum chains for daily wear.' },
  { name: 'Pendants', slug: 'pendants', image: '/images/site/pendants_category.png', description: 'Elegant and spiritual pendants matching your unique journey.' },
  { name: 'Bracelets', slug: 'bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800', description: 'Luxury wrist adornments and solid gold bracelets.' },
  { name: 'Bangles', slug: 'bangles', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800', description: 'Intricately designed bridal and daily wear bangles.' },
  { name: 'Mangalsutras', slug: 'mangalsutras', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800', description: 'Sacred wedding threads crafted with modern diamond accents.' },
  { name: 'Nose Pins', slug: 'nose-pin', image: '/images/site/nose_pins_category.png', description: 'Beautiful minimal diamond and gold nose pins.' },
  { name: 'Anklets', slug: 'anklets', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800', description: 'Sleek silver and gold anklets highlighting grace.' },
  { name: 'Brooches', slug: 'brooches', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800', description: 'Luxury suit pins and brooches for formal edits.' }
];

async function run() {
  console.log("Connecting to database...");
  await mongoose.connect(mongodbUri);
  console.log("Connected to MongoDB.");

  // 1. Re-seed Core Categories
  console.log("Replacing categories with core taxonomy...");
  await Category.deleteMany({});
  await Category.insertMany(CORE_CATEGORIES);
  console.log(`Seeded ${CORE_CATEGORIES.length} categories.`);

  // 2. Audit and Reclassify Existing Products
  console.log("Auditing existing products...");
  
  // Deactivate junk test products
  const junkSlugs = ['msandkljfk', 'dev-testing', 'test22'];
  const deactRes = await Product.updateMany(
    { slug: { $in: junkSlugs } },
    { $set: { isActive: false } }
  );
  console.log(`Deactivated ${deactRes.modifiedCount} junk products.`);

  // Reclassify Rings
  const ringSlugs = ['round-stone-eternity-band', 'diamond-multi-row-band', 'tri-stone-with-plan-band'];
  const ringRes = await Product.updateMany(
    { slug: { $in: ringSlugs } },
    { 
      $set: { category: 'rings' },
      $addToSet: { tags: { $each: ['rings', 'ring', 'diamond'] } }
    }
  );
  console.log(`Reclassified ${ringRes.modifiedCount} products as 'rings'.`);

  // Reclassify Pendants
  const pendantSlugs = [
    'gold-and-diamond-evil-right-eye-mizpah-charm',
    'gold-and-diamond-evil-left-eye-mizpa-charm',
    'gold-and-diamond-double-step-heart',
    'gold-and-diamond-supersize-script-love-pendent',
    'gold-and-diamond-open-curved-heart',
    'gold-and-diamond-open-heart',
    'gold-and-diamond-symbol-khanda-sahib',
    'diamond-and-gold-om-charm',
    'diamond-and-gold-shri-charm',
    'gold-and-diamond-tiny-jewish-star-charm',
    'guru-ji-name-plate-diamond-and-gold-initial'
  ];
  const pendantRes = await Product.updateMany(
    { slug: { $in: pendantSlugs } },
    { 
      $set: { category: 'pendants' },
      $addToSet: { tags: { $each: ['pendants', 'pendant', 'diamond'] } }
    }
  );
  console.log(`Reclassified ${pendantRes.modifiedCount} products as 'pendants'.`);

  // Normalize remaining categories lowercase
  const activeProducts = await Product.find({ isActive: { $ne: false } });
  let normalizedCount = 0;
  for (const product of activeProducts) {
    let currentCat = product.category || '';
    let targetCat = currentCat.toLowerCase().trim();
    if (targetCat === 'rings' || targetCat === 'earrings' || targetCat === 'pendants' || targetCat === 'nose-pin') {
      if (product.category !== targetCat) {
        product.category = targetCat;
        await product.save();
        normalizedCount++;
      }
    }
  }
  console.log(`Normalized ${normalizedCount} product category strings.`);

  // 3. Populate Empty Categories with realistic dummy products
  const EMPTY_CATEGORIES_DATA = [
    {
      category: 'necklaces',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
      items: [
        { name: 'Aria Diamond Choker Necklace', price: 95000, weight: 14.5, tags: ['diamond', 'bridal', 'women'] },
        { name: 'Classic Gold Collar Necklace', price: 68000, weight: 11.2, tags: ['gold', 'daily-wear', 'women'] },
        { name: 'Celestial Gemstone Riviere Necklace', price: 82000, weight: 13.0, tags: ['gemstone', 'festive', 'women'] },
        { name: 'Sleek Sterling Silver Collar', price: 18000, weight: 9.8, tags: ['silver', 'office-wear', 'women'] },
        { name: 'Royal Antique Bridal Necklace', price: 145000, weight: 24.0, tags: ['gold', 'bridal', 'women'] }
      ]
    },
    {
      category: 'chains',
      image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800',
      items: [
        { name: 'Royal Gold Rope Chain', price: 42000, weight: 8.5, tags: ['gold', 'daily-wear', 'unisex'] },
        { name: 'Sleek Platinum Box Chain', price: 54000, weight: 7.2, tags: ['platinum', 'office-wear', 'men'] },
        { name: 'Classic Curb Link Silver Chain', price: 12000, weight: 12.0, tags: ['silver', 'daily-wear', 'men'] },
        { name: 'Dainty Diamond Cut Gold Chain', price: 29000, weight: 4.5, tags: ['gold', 'daily-wear', 'women'] },
        { name: 'Heavy Figaro Gold Chain', price: 78000, weight: 15.0, tags: ['gold', 'festive', 'men'] }
      ]
    },
    {
      category: 'bracelets',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
      items: [
        { name: 'Celestial Pearl Link Bracelet', price: 34000, weight: 6.8, tags: ['diamond', 'office-wear', 'women'] },
        { name: 'Starlight Diamond Tennis Bracelet', price: 120000, weight: 9.5, tags: ['diamond', 'festive', 'women'] },
        { name: 'Cuban Link Gold Men\'s Bracelet', price: 85000, weight: 16.2, tags: ['gold', 'daily-wear', 'men'] },
        { name: 'Minimal Sterling Silver Cuff', price: 15000, weight: 8.0, tags: ['silver', 'office-wear', 'unisex'] },
        { name: 'Charmed Heart Kids Gold Bracelet', price: 22000, weight: 3.5, tags: ['gold', 'kids', 'kids'] }
      ]
    },
    {
      category: 'bangles',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
      items: [
        { name: 'Elegant Kundan Bangles Set', price: 110000, weight: 22.0, tags: ['gold', 'bridal', 'women'] },
        { name: 'Classic Filigree Gold Bangle', price: 48000, weight: 9.5, tags: ['gold', 'daily-wear', 'women'] },
        { name: 'Geometric Diamond Eternity Bangle', price: 92000, weight: 11.0, tags: ['diamond', 'festive', 'women'] },
        { name: 'Sleek Polished Gold Kada', price: 62000, weight: 12.5, tags: ['gold', 'daily-wear', 'men'] },
        { name: 'Ruby Floral Accent Bangle', price: 78000, weight: 10.8, tags: ['gemstone', 'festive', 'women'] }
      ]
    },
    {
      category: 'mangalsutras',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
      items: [
        { name: 'Sanskrit Gold Mangalsutra', price: 45000, weight: 8.8, tags: ['gold', 'daily-wear', 'women'] },
        { name: 'Modern Diamond Drop Mangalsutra', price: 67000, weight: 6.2, tags: ['diamond', 'office-wear', 'women'] },
        { name: 'Traditional Black Bead Mangalsutra', price: 38000, weight: 9.0, tags: ['gold', 'daily-wear', 'women'] },
        { name: 'Royal Solitaire Accent Mangalsutra', price: 89000, weight: 7.5, tags: ['diamond', 'festive', 'women'] },
        { name: 'Infinity Love Bond Mangalsutra', price: 54000, weight: 7.0, tags: ['diamond', 'office-wear', 'women'] }
      ]
    },
    {
      category: 'anklets',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
      items: [
        { name: 'Sleek Silver Curb Anklet', price: 6500, weight: 14.0, tags: ['silver', 'daily-wear', 'women'] },
        { name: 'Dainty Gold Bead Anklet', price: 24000, weight: 4.8, tags: ['gold', 'daily-wear', 'women'] },
        { name: 'Traditional Ghungroo Silver Payal', price: 9800, weight: 22.0, tags: ['silver', 'festive', 'women'] },
        { name: 'Diamond Charms Anklet', price: 45000, weight: 5.5, tags: ['diamond', 'festive', 'women'] },
        { name: 'Minimal Dual Thread Anklet', price: 5000, weight: 8.0, tags: ['silver', 'office-wear', 'women'] }
      ]
    },
    {
      category: 'brooches',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
      items: [
        { name: 'Gilded Floral Crystal Brooch', price: 14000, weight: 12.0, tags: ['silver', 'festive', 'women'] },
        { name: 'Royal Lion Lapel Brooch', price: 35000, weight: 10.5, tags: ['gold', 'festive', 'men'] },
        { name: 'Minimalist Diamond Shield Brooch', price: 58000, weight: 8.2, tags: ['diamond', 'office-wear', 'men'] },
        { name: 'Vintage Pearl Suit Pin', price: 19000, weight: 7.0, tags: ['gold', 'office-wear', 'unisex'] },
        { name: 'Enamelled Peacock Brooch', price: 27000, weight: 14.5, tags: ['gold', 'festive', 'women'] }
      ]
    }
  ];

  console.log("Seeding realistic dummy products for empty categories...");
  let dummyCount = 0;
  for (const catData of EMPTY_CATEGORIES_DATA) {
    const existingCount = await Product.countDocuments({ category: catData.category });
    if (existingCount === 0) {
      console.log(`Generating 5 dummy products for '${catData.category}'...`);
      for (const item of catData.items) {
        const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // Setup specifications
        const specs = {
          sku: `ZON-DEM-${catData.category.slice(0,2).toUpperCase()}-${slug.slice(0,3).toUpperCase()}`,
          metal: item.tags.includes('gold') ? 'yellow-gold' : item.tags.includes('silver') ? 'silver' : item.tags.includes('platinum') ? 'platinum' : 'yellow-gold',
          stone: item.tags.includes('diamond') ? 'diamond' : item.tags.includes('gemstone') ? 'ruby' : 'none',
          finish: 'High Polish',
          certification: 'IGI Certified',
          occasion: item.tags.includes('bridal') ? 'Wedding' : item.tags.includes('festive') ? 'Festive' : 'Everyday',
          isDemo: 'true' // marked internally
        };

        const metalsList = item.tags.includes('gold') ? ['Yellow Gold', 'Rose Gold'] : item.tags.includes('silver') ? ['Sterling Silver'] : ['Platinum'];
        const sizesList = catData.category === 'bangles' ? ['2.4', '2.6', '2.8'] : ['16 inches', '18 inches', '20 inches'];

        await Product.create({
          name: item.name,
          slug: `${slug}-demo`,
          category: catData.category,
          images: [catData.image],
          description: `A beautifully handcrafted masterpiece from our luxury ${catData.category} range. Designed with exquisite precision to feel timeless, elegant and light. (Demo Inventory)`,
          basePrice: item.price,
          makingCharges: Math.round(item.price * 0.1),
          baseWeight: item.weight,
          stockStatus: 'in-stock',
          isActive: true,
          tags: [...item.tags, 'featured', 'demo', catData.category],
          specs: specs,
          configurableOptions: {
            metals: metalsList,
            purities: ['18K', '14K'],
            sizes: sizesList,
            stones: item.tags.includes('diamond') ? ['VVS-EF', 'SI-GH'] : ['Natural'],
            customizations: ['Engraving']
          }
        });
        dummyCount++;
      }
    } else {
      console.log(`Category '${catData.category}' already has ${existingCount} products. Skipping dummy seeding.`);
    }
  }
  console.log(`Successfully seeded ${dummyCount} dummy products.`);

  await mongoose.disconnect();
  console.log("Database disconnected successfully.");
}

run().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
