import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import SpinAttempt from "@/models/SpinAttempt";
import Coupon from "@/models/Coupon";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Authentication is required" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    await dbConnect();

    // Fetch user attempts that won a coupon
    const attempts = await SpinAttempt.find({ 
      userId, 
      couponCode: { $exists: true, $ne: null } 
    }).sort({ createdAt: -1 });

    const codes = attempts.map(a => a.couponCode).filter(Boolean);

    // Fetch corresponding Coupon definitions
    const coupons = await Coupon.find({ code: { $in: codes } });
    const couponMap = new Map(coupons.map(c => [c.code, c]));

    // Fetch paid orders by user using these coupons
    const paidOrders = await Order.find({ 
      userId, 
      paymentStatus: "paid", 
      couponCode: { $in: codes } 
    }, "couponCode");
    
    const usedCodes = new Set(paidOrders.map(o => o.couponCode));

    const rewards = attempts.map(attempt => {
      const coupon = couponMap.get(attempt.couponCode || "");
      const isRedeemed = usedCodes.has(attempt.couponCode || "");
      
      let status: "active" | "redeemed" | "expired" | "inactive" = "active";
      
      if (isRedeemed) {
        status = "redeemed";
      } else if (coupon) {
        const now = new Date();
        if (new Date(coupon.expirationDate) < now) {
          status = "expired";
        } else if (!coupon.isActive) {
          status = "inactive";
        }
      }

      return {
        _id: attempt._id,
        couponCode: attempt.couponCode,
        wonAt: attempt.createdAt,
        claimedAt: attempt.claimedAt,
        status,
        couponDetails: coupon ? {
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minCartValue: coupon.minCartValue,
          maxDiscount: coupon.maxDiscount,
          expirationDate: coupon.expirationDate,
        } : null
      };
    });

    return NextResponse.json({ success: true, data: rewards });
  } catch (error: any) {
    console.error("[CUSTOMER REWARDS API] Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
