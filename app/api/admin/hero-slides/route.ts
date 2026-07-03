import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HeroSlide from '@/models/HeroSlide';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await dbConnect();
    // Return all slides for admin
    const slides = await HeroSlide.find({}).sort({ order: 1 });
    return NextResponse.json({ success: true, data: slides });
  } catch (error: any) {
    console.error('Error fetching admin hero slides:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newSlide = await HeroSlide.create(body);
    
    if (newSlide) {
      try {
        revalidatePath('/');
      } catch (e) {
        console.error("Revalidation error:", e);
      }
    }
    
    return NextResponse.json({ success: true, data: newSlide }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating hero slide:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
