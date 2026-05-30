import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import WheelPrize from "@/models/WheelPrize";
import Coupon from "@/models/Coupon";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const prizes = await WheelPrize.find().sort({ displayOrder: 1 });
    return NextResponse.json({ success: true, data: prizes });
  } catch (error: any) {
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

    if (body.couponId) {
      const coupon = await Coupon.findById(body.couponId);
      if (!coupon) {
        return NextResponse.json({ success: false, message: "Associated coupon not found" }, { status: 400 });
      }
      body.couponCode = coupon.code;
    } else {
      body.couponId = null;
      body.couponCode = "";
    }

    const prize = await WheelPrize.create(body);
    return NextResponse.json({ success: true, data: prize });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Prize ID is required" }, { status: 400 });
    }

    if (updateData.couponId) {
      const coupon = await Coupon.findById(updateData.couponId);
      if (!coupon) {
        return NextResponse.json({ success: false, message: "Associated coupon not found" }, { status: 400 });
      }
      updateData.couponCode = coupon.code;
    } else if (updateData.hasOwnProperty("couponId") && !updateData.couponId) {
      updateData.couponId = null;
      updateData.couponCode = "";
    }

    const prize = await WheelPrize.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    
    if (!prize) {
      return NextResponse.json({ success: false, message: "Prize not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: prize });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Prize ID is required" }, { status: 400 });
    }

    await WheelPrize.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Prize deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
