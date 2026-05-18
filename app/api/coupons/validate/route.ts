import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Coupon from "@/models/Coupon";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { code, cartTotal, customerId, cartItems } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, message: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return NextResponse.json({ success: false, message: "Invalid or expired coupon code" }, { status: 404 });
    }

    // Check expiration
    if (new Date() > coupon.expiryDate) {
      return NextResponse.json({ success: false, message: "This coupon has expired" }, { status: 400 });
    }

    // Check usage limit
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, message: "This coupon has reached its usage limit" }, { status: 400 });
    }

    // Check minimum purchase
    if (cartTotal < coupon.minPurchase) {
      return NextResponse.json({ 
        success: false, 
        message: `Minimum purchase of ₹${coupon.minPurchase.toLocaleString()} required for this coupon` 
      }, { status: 400 });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: discountAmount
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
