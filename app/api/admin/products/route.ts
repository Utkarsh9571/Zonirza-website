import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Secure access check
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const metal = searchParams.get("metal") || "";
    const stockStatus = searchParams.get("stockStatus") || "";
    const isActive = searchParams.get("isActive") || "";
    const tags = searchParams.get("tags") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const sort = searchParams.get("sort") || "newest";

    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};
    
    if (category) {
      // Handle case-insensitive category matches and common slug variations
      const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
      const categoryPatterns = [
        new RegExp(`^${category}$`, 'i'),
        new RegExp(`^${categorySlug}$`, 'i')
      ];
      
      // Special mappings for categories
      if (categorySlug === 'nose-pins') {
        categoryPatterns.push(new RegExp(`^nose-pin$`, 'i'));
      }
      
      filter.category = { $in: categoryPatterns };
    }

    if (metal) {
      // Map display metal names to DB slugs
      let metalSlug = metal.toLowerCase().replace(/\s+/g, '-');
      
      // Broaden "gold" to include "yellow-gold" if specifically requested or if it's the common term
      if (metalSlug === 'gold') {
        filter["specs.metal"] = { $regex: new RegExp('gold', 'i') };
      } else {
        filter["specs.metal"] = { $regex: new RegExp(metalSlug, 'i') };
      }
    }

    if (stockStatus) filter.stockStatus = stockStatus;
    if (isActive) filter.isActive = isActive === "true";
    
    if (tags) {
      // Handle case-insensitive tag matches
      const tagList = tags.split(",").map(t => t.trim().toLowerCase());
      filter.tags = { $in: tagList.map(t => new RegExp(`^${t}$`, 'i')) };
    }
    
    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.basePrice.$lte = parseFloat(maxPrice);
    }

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { slug: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ];
    }

    // Debug logging for query construction
    console.log("Admin Product Filter Params:", { category, metal, stockStatus, isActive, tags, query });
    console.log("Admin Product Filter Query:", JSON.stringify(filter, null, 2));

    // Build sort
    let sortObj: any = { createdAt: -1 };
    if (sort === "oldest") sortObj = { createdAt: 1 };
    else if (sort === "price-high") sortObj = { basePrice: -1 };
    else if (sort === "price-low") sortObj = { basePrice: 1 };
    else if (sort === "alphabetical") sortObj = { name: 1 };
    else if (sort === "updated") sortObj = { updatedAt: -1 };

    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);
    console.log("Admin Product Match Count:", total);

    return NextResponse.json({
      success: true,
      data: products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Admin Product API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const product = await Product.create(body);

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    console.error("Admin Product Create Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
