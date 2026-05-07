import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';

import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const categoryQuery = searchParams.get('category');
    
    let query = {};
    if (categoryQuery) {
      // Try to find if it's a slug
      const Category = (await import('@/models/Category')).default;
      const cat = await Category.findOne({ 
        $or: [
          { slug: categoryQuery },
          { name: { $regex: new RegExp(`^${categoryQuery}$`, 'i') } }
        ]
      });
      
      if (cat) {
        query = { category: cat.name };
      } else {
        // Fallback to searching by name OR tags
        query = { 
          $or: [
            { category: { $regex: new RegExp(`^${categoryQuery.replace(/-/g, ' ')}$`, 'i') } },
            { tags: { $in: [categoryQuery.toLowerCase()] } }
          ]
        };
      }
    }
    
    const limit = parseInt(searchParams.get('limit') || '0');
    
    let productsQuery = Product.find(query);
    if (limit > 0) {
      productsQuery = productsQuery.limit(limit);
    }
    
    const products = await productsQuery;
    
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
