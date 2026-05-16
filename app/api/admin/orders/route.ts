import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const query = searchParams.get("q") || "";

    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};
    if (query) {
      filter.$or = [
        { "shippingAddress.fullName": { $regex: query, $options: "i" } },
        { "shippingAddress.phone": { $regex: query, $options: "i" } },
        { _id: query.length === 24 ? query : undefined }, // Only search ID if it's a valid ObjectId length
      ].filter(f => Object.values(f)[0] !== undefined);
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Admin Order API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
