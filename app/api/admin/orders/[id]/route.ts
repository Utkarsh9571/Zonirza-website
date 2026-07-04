import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { sendEmail } from "@/lib/mailer";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { orderStatus, paymentStatus, trackingDetails, timelineNotes } = body;

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    let statusChanged = false;

    if (orderStatus && orderStatus !== order.orderStatus) {
      order.orderStatus = orderStatus;
      statusChanged = true;
      order.timeline.push({
        status: orderStatus,
        date: new Date(),
        notes: timelineNotes || ''
      });
    }

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingDetails) {
      order.trackingDetails = {
        ...order.trackingDetails,
        ...trackingDetails
      };
    }

    await order.save();

    if (statusChanged) {
      // Send luxury automated email
      const customerEmail = order.shippingAddress?.email || 'customer@example.com'; // Using fallback if email not in schema directly
      await sendEmail({
        to: customerEmail,
        subject: `Your Luxury Jewelry Masterpiece Update: ${orderStatus}`,
        html: `
          <div style="font-family: serif; color: #333; max-width: 600px; margin: 0 auto; text-align: center;">
            <h1 style="color: #cda434; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">Luxury Jewelry Luxury</h1>
            <div style="margin: 30px 0; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              <p style="font-size: 16px;">Dear ${order.shippingAddress?.fullName},</p>
              <p style="font-size: 14px; line-height: 1.6;">Your masterpiece has reached a new stage in its journey.</p>
              <h2 style="font-size: 20px; margin: 20px 0; color: #111;">Status Update: <strong>${orderStatus}</strong></h2>
              <p style="font-size: 12px; color: #666;">Order Reference: #${order._id.toString().slice(-8).toUpperCase()}</p>
            </div>
            <p style="font-size: 12px; color: #999; margin-top: 40px;">Luxury Jewelry Concierge Services</p>
          </div>
        `
      });
    }

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error("Admin Order Update Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error("Admin Order Detail Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
