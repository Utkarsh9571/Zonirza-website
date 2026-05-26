import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HeroSlide from '@/models/HeroSlide';

export async function GET() {
  try {
    await dbConnect();
    // Only return active slides, sorted by order
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json({ success: true, data: slides });
  } catch (error: any) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
