const fs = require('fs');
const path = require('path');

/**
 * Script to parse tbl_products.sql and extract product data into JSON.
 */

const SQL_FILE = path.join(__dirname, '../tbl_products.sql');
const PARSED_FILE = path.join(__dirname, '../parsedProducts.json');
const CLEAN_FILE = path.join(__dirname, '../cleanProducts.json');

function parseSql() {
  console.log(`Reading ${SQL_FILE}...`);
  
  if (!fs.existsSync(SQL_FILE)) {
    console.error(`Error: File ${SQL_FILE} not found.`);
    process.exit(1);
  }

  const content = fs.readFileSync(SQL_FILE, 'utf8');
  
  // Extract INSERT INTO tbl_products statements
  const insertRegex = /INSERT INTO\s+`?tbl_products`?\s*\((.*?)\)\s+VALUES\s*([\s\S]*?);/gi;
  
  let match;
  const allProducts = [];

  while ((match = insertRegex.exec(content)) !== null) {
    const columns = match[1].split(',').map(col => col.trim().replace(/`/g, ''));
    const valuesPart = match[2].trim();

    const rows = splitValuesIntoRows(valuesPart);

    rows.forEach(row => {
      const parsedValues = parseRowValues(row);
      const product = {};
      
      const requiredKeys = [
        'product_title',
        'product_slug',
        'price',
        'description',
        'category_id',
        'subcategory_id',
        'gallery',
        'gender',
        'product_type',
        'feature',
        'topselling'
      ];

      columns.forEach((col, index) => {
        if (requiredKeys.includes(col)) {
          let val = parsedValues[index];
          
          if (typeof val === 'string') {
            val = val
              .replace(/\\'/g, "'")
              .replace(/\\"/g, '"')
              .replace(/\\n/g, '\n')
              .replace(/\\r/g, '\r')
              .replace(/\\t/g, '\t')
              .replace(/\\\\/g, '\\');
          }
          
          product[col] = val;
        }
      });
      
      requiredKeys.forEach(key => {
        if (product[key] === undefined) {
          product[key] = null;
        }
      });

      allProducts.push(product);
    });
  }

  console.log(`Successfully parsed ${allProducts.length} raw products.`);
  
  // Save intermediate parsed objects
  fs.writeFileSync(PARSED_FILE, JSON.stringify(allProducts, null, 2), 'utf8');
  
  // Transform to MongoDB-ready format
  const cleanProducts = transformProducts(allProducts);
  
  console.log(`Successfully transformed ${cleanProducts.length} products.`);
  
  // Save to clean JSON
  fs.writeFileSync(CLEAN_FILE, JSON.stringify(cleanProducts, null, 2), 'utf8');
  console.log(`\nResults saved to ${CLEAN_FILE}`);
}

/**
 * Transforms raw SQL data into clean MongoDB format.
 */
function transformProducts(products) {
  return products.map(p => {
    // Skip invalid entries (must have title and slug)
    if (!p.product_title || !p.product_slug) return null;

    // 1. Images: Parse gallery JSON or split comma-separated string
    let images = [];
    if (p.gallery) {
      try {
        // Try parsing as JSON if it looks like JSON
        if (p.gallery.trim().startsWith('[') || p.gallery.trim().startsWith('{')) {
          const parsed = JSON.parse(p.gallery);
          images = Array.isArray(parsed) ? parsed : [parsed];
        } else {
          // Fallback to comma-separated
          images = p.gallery.split(',').map(img => img.trim());
        }
      } catch (e) {
        // If JSON parse fails, split by comma
        images = p.gallery.split(',').map(img => img.trim());
      }
    }
    // Clean and flatten images
    images = images.filter(img => img && typeof img === 'string' && img.length > 0);

    // 2. Tags: Build from various fields
    const tags = [];
    
    // Gender mapping
    if (String(p.gender) === '1') tags.push('men');
    else if (String(p.gender) === '2') tags.push('women');
    else if (p.gender && typeof p.gender === 'string') tags.push(p.gender.toLowerCase());

    // Product Type
    if (p.product_type) tags.push(p.product_type.toLowerCase());

    // Feature -> featured
    if (Number(p.feature) === 1) tags.push('featured');

    // Topselling -> trending
    if (Number(p.topselling) === 1) tags.push('trending');

    return {
      name: p.product_title,
      slug: p.product_slug,
      price: p.price ? Number(p.price) : 0,
      description: p.description || "",
      images: images,
      category_id: p.category_id,
      tags: [...new Set(tags)] // Ensure unique tags
    };
  }).filter(p => p !== null); // Remove skipped entries
}

function splitValuesIntoRows(valuesPart) {
  const rows = [];
  let current = '';
  let parenLevel = 0;
  let inString = false;
  let escape = false;

  for (let i = 0; i < valuesPart.length; i++) {
    const char = valuesPart[i];

    if (escape) {
      current += char;
      escape = false;
      continue;
    }

    if (char === '\\') {
      current += char;
      escape = true;
      continue;
    }

    if (char === "'" && !escape) {
      inString = !inString;
    }

    if (!inString) {
      if (char === '(') {
        parenLevel++;
        if (parenLevel === 1) {
          current = ''; // Start of a row
          continue;
        }
      }
      if (char === ')') {
        parenLevel--;
        if (parenLevel === 0) {
          rows.push(current);
          continue;
        }
      }
    }

    if (parenLevel > 0) {
      current += char;
    }
  }

  return rows;
}

/**
 * Parses a single row string into an array of values.
 * Example: "1, 'Hello, World', NULL" -> [1, "Hello, World", null]
 */
function parseRowValues(rowStr) {
  const values = [];
  let current = '';
  let inString = false;
  let escape = false;

  for (let i = 0; i < rowStr.length; i++) {
    const char = rowStr[i];

    if (escape) {
      current += char;
      escape = false;
      continue;
    }

    if (char === '\\') {
      current += char;
      escape = true;
      continue;
    }

    if (char === "'" && !escape) {
      inString = !inString;
      continue; // Don't include the quote itself yet, or handle later
    }

    if (char === ',' && !inString) {
      values.push(finalizeValue(current));
      current = '';
      continue;
    }

    current += char;
  }
  
  values.push(finalizeValue(current));
  return values;
}

function finalizeValue(val) {
  val = val.trim();
  if (val.toUpperCase() === 'NULL') return null;
  
  // If it's a number (and not a string that looks like a number but was quoted)
  // Actually, in SQL, if it's not quoted, it's a number.
  // Our parseRowValues already stripped outer quotes by not adding them.
  if (!isNaN(val) && val !== '' && !val.includes("'")) {
    return Number(val);
  }
  
  return val;
}

parseSql();
