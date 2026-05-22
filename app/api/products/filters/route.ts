import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { parseSearchIntent, buildMongoQuery } from '@/lib/searchEngine';
import Collection from '@/models/Collection';

/**
 * Intelligent Contextual Filters API
 * Scans available products to return exactly what filters are currently valid.
 * Avoids the "0 results" dead-end by only surfacing options that exist.
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const collectionSlug = searchParams.get('collection');
    const q = searchParams.get('q');

    let baseQuery: any = { isActive: true };

    if (category) {
      baseQuery.category = new RegExp(category, 'i');
    }

    if (collectionSlug) {
      const collection = await Collection.findOne({ slug: collectionSlug });
      if (collection && collection.tags.length > 0) {
        baseQuery.tags = { $in: collection.tags.map((t: string) => new RegExp(t, 'i')) };
      }
    }

    if (q) {
      const intent = parseSearchIntent(q);
      const searchMongoQuery = buildMongoQuery(intent);
      // Merge search query into base query
      baseQuery = { $and: [baseQuery, searchMongoQuery] };
    }

    // Aggregate to find unique metals, purities, stones, and min/max prices
    const pipeline = [
      { $match: baseQuery },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$basePrice" },
          maxPrice: { $max: "$basePrice" },
          metals: { $addToSet: "$specs.metal" },
          stones: { $addToSet: "$specs.stone" },
          configurableMetals: { $push: "$configurableOptions.metals" },
          configurableStones: { $push: "$configurableOptions.stones" },
          tags: { $push: "$tags" }
        }
      }
    ];

    const result = await Product.aggregate(pipeline);

    if (!result || result.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          priceRange: { min: 0, max: 0 },
          metals: [],
          stones: [],
          styles: []
        }
      });
    }

    const agg = result[0];

    // Flatten nested arrays and remove nulls/undefined/empty
    const extractUnique = (arrOfArrs: any[]) => {
      const flat = arrOfArrs.flat(2).filter(Boolean);
      return Array.from(new Set(flat));
    };

    const allMetals = new Set([
      ...agg.metals.filter(Boolean),
      ...extractUnique(agg.configurableMetals)
    ]);

    const allStones = new Set([
      ...agg.stones.filter(Boolean),
      ...extractUnique(agg.configurableStones)
    ]);

    // Extract potential styles from tags
    const allTags = extractUnique(agg.tags);
    const STYLES = ['minimal', 'minimalist', 'bridal', 'wedding', 'daily', 'office', 'statement', 'vintage', 'classic', 'modern', 'casual', 'party'];
    const activeStyles = allTags.filter(tag => STYLES.includes(tag.toLowerCase()));

    return NextResponse.json({
      success: true,
      data: {
        priceRange: { 
          min: agg.minPrice || 0, 
          max: agg.maxPrice || 0 
        },
        metals: Array.from(allMetals).sort(),
        stones: Array.from(allStones).sort(),
        styles: activeStyles.sort()
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
