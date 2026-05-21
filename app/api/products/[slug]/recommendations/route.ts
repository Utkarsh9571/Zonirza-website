import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(req: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    await dbConnect();
    const params = await context.params;
    const { slug } = params;

    // First find the current product to get its category and tags
    const currentProduct = await Product.findOne({ slug });
    if (!currentProduct) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // Find products in the same category or with matching tags, excluding the current product
    const recommendations = await Product.find({
      _id: { $ne: currentProduct._id },
      isActive: true,
      $or: [
        { category: currentProduct.category },
        { tags: { $in: currentProduct.tags } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(8);

    return NextResponse.json({ success: true, data: recommendations });
  } catch (error: any) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
