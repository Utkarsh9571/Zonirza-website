import { NextResponse } from 'next/server';
import { tryDbConnect } from '@/lib/db';
import Category from '@/models/Category';
import { MOCK_CATEGORIES } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const connected = await tryDbConnect();
    if (!connected) {
      return NextResponse.json({ success: true, data: MOCK_CATEGORIES, _demo: true });
    }
    const categories = await Category.find({});
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: true, data: MOCK_CATEGORIES, _demo: true });
  }
}

