import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    const reviews = await Review.find({ product: productId, status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { productId, rating, title, comment, images } = body;

    if (!productId || !rating || !title || !comment) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Check if the user has purchased the product
    let isVerifiedPurchase = false;
    const userOrders = await Order.find({ user: (session.user as any).id, status: { $in: ['Delivered', 'Completed'] } });
    for (const order of userOrders) {
      if (order.items.some((item: any) => item.product.toString() === productId)) {
        isVerifiedPurchase = true;
        break;
      }
    }

    const newReview = await Review.create({
      product: productId,
      user: (session.user as any).id,
      userName: session.user.name || 'Anonymous',
      rating,
      title,
      comment,
      images: images || [],
      isVerifiedPurchase,
      status: 'pending' // Admin needs to approve
    });

    return NextResponse.json({ success: true, data: newReview });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
