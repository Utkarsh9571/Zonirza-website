const fs = require('fs');
const path = require('path');

// --- Paths ---
const DATA_DIR = path.join(__dirname, '../data');
const OUTPUT_FILE = path.join(__dirname, '../cleanProducts.json');

// --- Helper to load DB-dump style JSON ---
function loadDbJson(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: ${filename} not found.`);
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    const parsed = JSON.parse(content);
    // If it has the { type: 'table', data: [...] } structure
    if (Array.isArray(parsed)) {
      const tableObj = parsed.find(item => item.type === 'table' && item.data);
      if (tableObj) return tableObj.data;
      return parsed; // Fallback to raw array
    }
    return [];
  } catch (e) {
    console.error(`Error parsing ${filename}:`, e);
    return [];
  }
}

// --- Main Transformation ---
function transform() {
  console.log('Starting data transformation...');

  // 1. Load data
  const rawProducts = loadDbJson('tbl_products.json');
  const mainCategories = loadDbJson('tbl_maincategory.json');
  const subCategories = loadDbJson('tbl_subcategory.json');
  const metalTypes = loadDbJson('metal_type.json');
  const karats = loadDbJson('tbl_karat.json');
  const sizes = loadDbJson('tbl_size.json');

  console.log(`Loaded ${rawProducts.length} raw products.`);

  // 2. Build Lookup Maps
  const mainCatMap = {};
  mainCategories.forEach(c => {
    mainCatMap[c.maincategory_id] = c.maincategory_name;
  });

  const subCatMap = {};
  subCategories.forEach(c => {
    subCatMap[c.id] = c.name;
  });

  const metalMap = {};
  metalTypes.forEach(m => {
    metalMap[m.id] = m.show_name || m.color_name;
  });

  const karatMap = {};
  karats.forEach(k => {
    karatMap[k.id] = `${k.value}K`;
  });

  const sizeMap = {};
  sizes.forEach(s => {
    sizeMap[s.id] = s.value;
  });

  // 3. Process Products
  const cleanProducts = [];
  const slugs = new Set();
  let skippedCount = 0;
  let successCount = 0;

  rawProducts.forEach(p => {
    // Skip if no title or slug
    if (!p.product_title || !p.product_slug) {
      skippedCount++;
      return;
    }

    // Handle duplicate slugs
    let slug = p.product_slug;
    if (slugs.has(slug)) {
      slug = `${slug}-${p.product_id}`;
    }
    slugs.add(slug);

    // Images: Parse gallery
    let images = [];
    if (p.gallery) {
      try {
        const galleryObj = JSON.parse(p.gallery);
        // galleryObj is { "2": [img1, img2], "3": [...] }
        Object.values(galleryObj).forEach(imgList => {
          if (Array.isArray(imgList)) {
            images.push(...imgList);
          }
        });
      } catch (e) {
        // If not JSON, maybe comma separated?
        if (typeof p.gallery === 'string') {
          images = p.gallery.split(',').map(img => img.trim()).filter(Boolean);
        }
      }
    }
    // Filter out invalid image names
    images = images.filter(img => img && typeof img === 'string' && img.length > 5);

    // Category: Prefer Subcategory name, fallback to Main category
    const categoryName = subCatMap[p.subcategory_id] || mainCatMap[p.category_id] || 'Jewellery';

    // Tags
    const tags = new Set();
    if (p.gender === '1') tags.add('men');
    if (p.gender === '2') tags.add('women');
    if (p.product_type) tags.add(p.product_type.toLowerCase());
    if (p.feature === '1') tags.add('featured');
    if (p.topselling === '1') tags.add('trending');
    
    // Add category-based tags
    if (categoryName) tags.add(categoryName.toLowerCase());

    // Specs
    const specs = {};
    if (p.karat_id) {
      const kIds = p.karat_id.split(',');
      specs.karat = kIds.map(id => karatMap[id.trim()]).filter(Boolean).join(', ');
    }
    if (p.metal_type) {
      const mIds = p.metal_type.split(',');
      specs.metal = mIds.map(id => metalMap[id.trim()]).filter(Boolean).join(', ');
    }
    if (p.size_id) {
      const sIds = p.size_id.split(',');
      specs.size = sIds.map(id => sizeMap[id.trim()]).filter(Boolean).join(', ');
    }
    if (p.product_code) specs.sku = p.product_code;

    // Price
    const price = parseFloat(p.price) || 0;

    cleanProducts.push({
      name: p.product_title,
      slug: slug,
      description: p.description || p.product_title,
      price: price,
      images: images,
      category: categoryName,
      tags: Array.from(tags),
      specs: specs
    });

    successCount++;
  });

  // 4. Process Categories (Include Main and Sub categories)
  const cleanCategories = [];
  const catSlugs = new Set();

  // Add Main Categories
  mainCategories.forEach(c => {
    if (!c.maincategory_name || !c.maincategory_slug) return;
    const slug = c.maincategory_slug.toLowerCase().replace(/\s+/g, '-');
    if (catSlugs.has(slug)) return;

    cleanCategories.push({
      name: c.maincategory_name,
      slug: slug,
      image: c.maincategory_image || 'https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=600',
      description: c.meta_description || c.maincategory_name
    });
    catSlugs.add(slug);
  });

  // Add Sub Categories
  subCategories.forEach(s => {
    if (!s.name || !s.slug) return;
    const slug = s.slug.toLowerCase().replace(/\s+/g, '-');
    if (catSlugs.has(slug)) return;

    cleanCategories.push({
      name: s.name,
      slug: slug,
      image: 'https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=600',
      description: s.meta_description || s.name
    });
    catSlugs.add(slug);
  });

  // 5. Save
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cleanProducts, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, '../cleanCategories.json'), JSON.stringify(cleanCategories, null, 2));
  
  console.log('\n--- Transformation Summary ---');
  console.log(`Total Raw Products: ${rawProducts.length}`);
  console.log(`Successfully Transformed: ${successCount}`);
  console.log(`Skipped (Invalid): ${skippedCount}`);
  console.log(`Total Categories: ${cleanCategories.length}`);
  console.log(`Clean data saved to: ${OUTPUT_FILE} and cleanCategories.json`);
}

transform();
