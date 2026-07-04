import { NextRequest, NextResponse } from "next/server";
import { tryDbConnect } from "@/lib/db";
import HomepageContent from "@/models/HomepageContent";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mockData";

export async function GET(req: NextRequest) {
  try {
    const connected = await tryDbConnect();
    if (!connected) {
      // Return a simulated homepage structure using mock products and categories
      const demoHomepageContent = {
        _id: "demo-homepage",
        heroSlides: [],
        featuredProducts: MOCK_PRODUCTS.slice(0, 4),
        featuredCollections: MOCK_CATEGORIES.slice(0, 3),
        updatedAt: new Date(),
      };
      return NextResponse.json({ success: true, data: demoHomepageContent, _demo: true });
    }
    const content = await HomepageContent.findOne().populate('featuredProducts featuredCollections');
    
    if (!content) {
      return NextResponse.json({ success: true, data: null });
    }

    return NextResponse.json({ success: true, data: content });
  } catch (error: any) {
    const demoHomepageContent = {
      _id: "demo-homepage",
      heroSlides: [],
      featuredProducts: MOCK_PRODUCTS.slice(0, 4),
      featuredCollections: MOCK_CATEGORIES.slice(0, 3),
      updatedAt: new Date(),
    };
    return NextResponse.json({ success: true, data: demoHomepageContent, _demo: true });
  }
}

