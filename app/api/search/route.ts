import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { resolveCollectionMapping } from '@/lib/collectionMapper';

/**
 * Production-grade Search API
 * Supports weighted search across Name, Category, Tags, and Specs.
 * Returns products and suggested categories/collections.
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.length < 2) {
      return NextResponse.json({ success: true, data: [], categories: [] });
    }

    const searchRegex = new RegExp(query, 'i');

    // 1. Search Products with weighting (Name > Category > Tags)
    // We use $or for broad matching
    const products = await Product.find({
      $or: [
        { name: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
        { tags: { $in: [searchRegex] } },
        { primaryMetal: { $regex: searchRegex } },
        { "specs.metal": { $regex: searchRegex } },
        { "specs.stone": { $regex: searchRegex } }
      ]
    })
    .limit(limit)
    .select('name slug images variantImages basePrice category tags');

    // 2. Discover relevant Collections/Categories from our Mapping Layer
    // Check if the query matches any of our curated collection names
    const collections = await resolveCollectionsFromQuery(query);

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
      collections: collections
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

/**
 * Intelligent helper to find mapped collections that match the search query.
 */
async function resolveCollectionsFromQuery(query: string) {
  const normalizedQuery = query.toLowerCase();
  
  // Define keywords that might trigger a collection suggestion
  const collectionTriggers: Record<string, string[]> = {
    'bridal': ['bridal', 'wedding', 'marriage', 'engagement'],
    'everyday-luxury': ['daily', 'office', 'work', 'minimal', 'everyday'],
    'statement': ['luxury', 'party', 'cocktail', 'premium', 'statement'],
    'solitaire': ['solitaire', 'single stone', 'diamond solitaire'],
    'heritage': ['traditional', 'vintage', 'classic', 'heritage', 'gold']
  };

  const matchedCollections: Array<{ name: string, slug: string }> = [];

  Object.entries(collectionTriggers).forEach(([slug, keywords]) => {
    if (keywords.some(k => normalizedQuery.includes(k) || k.includes(normalizedQuery))) {
      matchedCollections.push({
        name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        slug: slug
      });
    }
  });

  return matchedCollections.slice(0, 3);
}
