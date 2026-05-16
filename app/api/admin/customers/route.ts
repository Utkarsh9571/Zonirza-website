import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
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
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    // Enrich users with order stats
    const enrichedUsers = await Promise.all(users.map(async (user) => {
      const orderCount = await Order.countDocuments({ "shippingAddress.email": user.email });
      const totalSpent = await Order.aggregate([
        { $match: { "shippingAddress.email": user.email, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      return {
        ...user.toObject(),
        orderCount,
        totalSpent: totalSpent[0]?.total || 0
      };
    }));

    return NextResponse.json({
      success: true,
      data: enrichedUsers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Admin Customers API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
