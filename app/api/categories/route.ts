import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({});
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
