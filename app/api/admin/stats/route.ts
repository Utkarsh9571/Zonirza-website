import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();

    // 1. Revenue Calculation (Total of paid orders)
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    // 2. Active Orders (Processing or Shipped)
    const activeOrders = await Order.countDocuments({ 
      orderStatus: { $in: ['placed', 'confirmed', 'processing', 'shipped'] } 
    });

    // 3. Total Products
    const totalProducts = await Product.countDocuments();

    // 4. Customers Count (Non-admin users)
    const totalCustomers = await User.countDocuments();

    // 5. Recent Orders for the table
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // 6. Low Stock Alert (Out of stock or custom threshold)
    const lowStockCount = await Product.countDocuments({ stockStatus: 'out-of-stock' });

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        activeOrders,
        totalProducts,
        totalCustomers,
        lowStockCount
      },
      recentOrders
    });
  } catch (error: any) {
    console.error("Admin Stats API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
