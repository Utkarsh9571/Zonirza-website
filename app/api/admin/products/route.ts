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
    const filterType = searchParams.get("filter") || "";

    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};
    
    if (filterType === 'low-stock') {
      filter.stockStatus = 'out-of-stock';
    }

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { slug: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ];
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

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
