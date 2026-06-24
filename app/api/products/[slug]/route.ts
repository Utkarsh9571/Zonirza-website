import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params;
    const product = await Product.findOne({ slug, isActive: { $ne: false } }).lean();
    
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Hydrate Category Config
    const Category = (await import('@/models/Category')).default;
    const category = await Category.findOne({ slug: product.category }).lean();
    
    if (category && category.config) {
      product.categoryConfig = category.config;
    }
    
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
