import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const reviews = await Review.find().populate('product', 'name slug images').sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    console.error('Error fetching admin reviews:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const updatedReview = await Review.findByIdAndUpdate(id, { status }, { new: true }).populate('product');
    
    if (!updatedReview) {
      return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    }

    try {
      revalidatePath('/');
      if (updatedReview.product && (updatedReview.product as any).slug) {
        revalidatePath(`/product/${(updatedReview.product as any).slug}`);
      }
    } catch (e) {
      console.error("Revalidation error:", e);
    }

    return NextResponse.json({ success: true, data: updatedReview });
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Review ID is required' }, { status: 400 });
    }

    const review = await Review.findById(id).populate('product');
    await Review.findByIdAndDelete(id);

    if (review) {
      try {
        revalidatePath('/');
        if (review.product && (review.product as any).slug) {
          revalidatePath(`/product/${(review.product as any).slug}`);
        }
      } catch (e) {
        console.error("Revalidation error:", e);
      }
    }

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
