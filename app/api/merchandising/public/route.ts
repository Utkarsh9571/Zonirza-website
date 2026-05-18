import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import HomepageContent from "@/models/HomepageContent";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const content = await HomepageContent.findOne().populate('featuredProducts featuredCollections');
    
    if (!content) {
      return NextResponse.json({ success: true, data: null });
    }

    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
