import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    console.log('--- Product Search Debug ---');
    console.log('Incoming Params:', Object.fromEntries(searchParams.entries()));

    // Define all supported filter keys
    const filterKeys = [
      'category', 'tags', 'collection', 'gender', 
      'occasion', 'metal', 'stone', 'style', 'tag'
    ];
    
    let mongoQuery: any = {};
    const conditions: any[] = [];

    filterKeys.forEach(key => {
      const value = searchParams.get(key);
      if (value) {
        // Normalize values: handle plural/singular and common synonyms
        const values = value.split(',').map(v => {
          let normalized = v.trim().replace(/-/g, ' ').toLowerCase();
          // Simple plural to singular mapping
          if (normalized.endsWith('s')) {
            const singular = normalized.slice(0, -1);
            return [normalized, singular];
          }
          return [normalized];
        }).flat();
        
        console.log(`Processing filter [${key}]:`, values);

        // Match in multiple possible fields for maximum flexibility
        conditions.push({
          $or: [
            { category: { $in: values.map(v => new RegExp(`^${v}$`, 'i')) } },
            { tags: { $in: values } },
            { [`specs.${key}`]: { $in: values.map(v => new RegExp(`.*${v}.*`, 'i')) } },
            // Search in name as fallback for categories like "rings"
            { name: { $in: values.map(v => new RegExp(`.*${v}.*`, 'i')) } },
            // Check specs generally if key is metal/stone
            { "specs.metal": { $in: values.map(v => new RegExp(`.*${v}.*`, 'i')) } },
            { "specs.stone": { $in: values.map(v => new RegExp(`.*${v}.*`, 'i')) } }
          ]
        });
      }
    });

    if (conditions.length > 0) {
      mongoQuery.$and = conditions;
    }

    // 2. Handle Price Range
    const priceMin = parseFloat(searchParams.get('price_min') || '0');
    const priceMax = parseFloat(searchParams.get('price_max') || '0');
    
    if (priceMin > 0 || priceMax > 0) {
      mongoQuery.basePrice = {};
      if (priceMin > 0) mongoQuery.basePrice.$gte = priceMin;
      if (priceMax > 0) mongoQuery.basePrice.$lte = priceMax;
    }

    console.log('Generated MongoDB Query:', JSON.stringify(mongoQuery, null, 2));

    // 3. Pagination & Sorting
    const limit = parseInt(searchParams.get('limit') || '0');
    const sortParam = searchParams.get('sort') || 'newest';
    
    let sortOptions: any = { createdAt: -1 };
    if (sortParam === 'price-low') sortOptions = { basePrice: 1 };
    if (sortParam === 'price-high') sortOptions = { basePrice: -1 };
    if (sortParam === 'oldest') sortOptions = { createdAt: 1 };

    let productsQuery = Product.find(mongoQuery).sort(sortOptions);
    if (limit > 0) {
      productsQuery = productsQuery.limit(limit);
    }
    
    const products = await productsQuery;
    const total = await Product.countDocuments(mongoQuery);
    
    return NextResponse.json({ 
      success: true, 
      count: products.length,
      total,
      data: products 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
