import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { resolveCollectionMapping } from '@/lib/collectionMapper';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    console.log('--- Product Search Debug ---');
    console.log('Incoming Params:', Object.fromEntries(searchParams.entries()));
    
    // 1. Support fetching specific slugs (for Wishlist)
    const slugs = searchParams.get('slugs');
    if (slugs) {
      const slugList = slugs.split(',');
      const products = await Product.find({ slug: { $in: slugList } });
      return NextResponse.json({ success: true, data: products, total: products.length });
    }

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
        // Special Handling for 'collection' mapping
        if (key === 'collection') {
          const mapping = resolveCollectionMapping(value);
          if (mapping) {
            const collectionConditions: any[] = [];
            
            if (mapping.tags) collectionConditions.push({ tags: { $in: mapping.tags } });
            if (mapping.categories) collectionConditions.push({ category: { $in: mapping.categories.map(c => new RegExp(`^${c.replace(/-/g, ' ')}$`, 'i')) } });
            if (mapping.gender) collectionConditions.push({ "specs.gender": { $in: mapping.gender } });
            
            // Handle specs in mapping
            if (mapping.specs) {
              Object.entries(mapping.specs).forEach(([specKey, specValues]) => {
                collectionConditions.push({ [`specs.${specKey}`]: { $in: specValues.map(v => new RegExp(`.*${v}.*`, 'i')) } });
              });
            }

            // Handle price in mapping
            if (mapping.minPrice || mapping.maxPrice) {
              const priceCond: any = {};
              if (mapping.minPrice) priceCond.$gte = mapping.minPrice;
              if (mapping.maxPrice) priceCond.$lte = mapping.maxPrice;
              collectionConditions.push({ basePrice: priceCond });
            }

            if (collectionConditions.length > 0) {
              conditions.push({ $or: collectionConditions });
            }
            return; // Skip normal processing for this key
          }
        }

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

    // 2. Handle Fallback if count is low
    const collectionName = searchParams.get('collection');
    const initialCount = await Product.countDocuments(mongoQuery);
    
    if (collectionName && initialCount < 4) {
      const mapping = resolveCollectionMapping(collectionName);
      if (mapping && mapping.fallbackTags) {
        mongoQuery = { 
          $or: [
            mongoQuery,
            { tags: { $in: mapping.fallbackTags } }
          ]
        };
      }
    }

    console.log('Final MongoDB Query:', JSON.stringify(mongoQuery, null, 2));

    // 3. Pagination & Sorting
    const limit = parseInt(searchParams.get('limit') || '0');
    const sortParam = searchParams.get('sort') || 'newest';
    
    let sortOptions: any = { createdAt: -1 };
    if (sortParam === 'price-low') sortOptions = { basePrice: 1 };
    if (sortParam === 'price-high') sortOptions = { basePrice: -1 };
    if (sortParam === 'oldest') sortOptions = { createdAt: 1 };

    let finalQuery = Product.find(mongoQuery).sort(sortOptions);
    if (limit > 0) {
      finalQuery = finalQuery.limit(limit);
    }
    
    const products = await finalQuery;
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
