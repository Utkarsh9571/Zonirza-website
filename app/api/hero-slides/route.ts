import { NextResponse } from 'next/server';
import { tryDbConnect } from '@/lib/db';
import HeroSlide from '@/models/HeroSlide';
import { MOCK_HERO_SLIDES } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const connected = await tryDbConnect();
    if (!connected) {
      return NextResponse.json({ success: true, data: MOCK_HERO_SLIDES, _demo: true });
    }
    // Only return active slides, sorted by order
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json({ success: true, data: slides });
  } catch (error: any) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json({ success: true, data: MOCK_HERO_SLIDES, _demo: true });
  }
}
