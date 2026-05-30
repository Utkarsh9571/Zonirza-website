import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import SpinAttempt from "@/models/SpinAttempt";
import Order from "@/models/Order";
import User from "@/models/User"; // Ensure User model is loaded for populate

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    // --- Compute Metrics ---
    const totalSpins = await SpinAttempt.countDocuments();
    
    // Unique participants calculation: distinct userIds + unique guest (IP, UA) combinations
    const uniqueUsers = await SpinAttempt.distinct("userId", { userId: { $ne: null } });
    const uniqueGuestsGroup = await SpinAttempt.aggregate([
      { $match: { userId: null } },
      { $group: { _id: { ipAddress: "$ipAddress", userAgent: "$userAgent" } } },
      { $count: "count" }
    ]);
    const uniqueGuestsCount = uniqueGuestsGroup[0]?.count || 0;
    const uniqueParticipants = uniqueUsers.length + uniqueGuestsCount;

    // Wins
    const couponWins = await SpinAttempt.countDocuments({ couponCode: { $exists: true, $ne: null } });
    const claimedWins = await SpinAttempt.countDocuments({ couponCode: { $exists: true, $ne: null }, claimed: true });

    // Redemptions: Paid orders that used one of the won coupons
    const wonCoupons = await SpinAttempt.distinct("couponCode", { couponCode: { $exists: true, $ne: null } });
    const redemptions = await Order.countDocuments({
      couponCode: { $in: wonCoupons },
      paymentStatus: "paid"
    });

    // --- Fetch History Logs ---
    const attempts = await SpinAttempt.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalAttempts = totalSpins;
    const totalPages = Math.ceil(totalAttempts / limit);

    return NextResponse.json({
      success: true,
      metrics: {
        totalSpins,
        uniqueParticipants,
        couponWins,
        claimedWins,
        redemptions,
        winRate: totalSpins > 0 ? ((couponWins / totalSpins) * 100).toFixed(1) : 0,
        redemptionRate: couponWins > 0 ? ((redemptions / couponWins) * 100).toFixed(1) : 0,
      },
      data: attempts,
      pagination: {
        total: totalAttempts,
        page,
        limit,
        pages: totalPages,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
