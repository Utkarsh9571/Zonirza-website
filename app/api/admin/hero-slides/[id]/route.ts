import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HeroSlide from '@/models/HeroSlide';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id } = await params;
    const updatedSlide = await HeroSlide.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!updatedSlide) {
      return NextResponse.json({ success: false, error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedSlide });
  } catch (error: any) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedSlide = await HeroSlide.findByIdAndDelete(id);
    
    if (!deletedSlide) {
      return NextResponse.json({ success: false, error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
