import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    return NextResponse.json({ success: true, data: settings.pricingFactors });
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

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    settings.pricingFactors = {
      ...settings.pricingFactors,
      ...body
    };

    // Ensure Mongoose Map structures are respected
    if (body.diamondPrices) {
      settings.pricingFactors.diamondPrices = new Map(Object.entries(body.diamondPrices));
    }
    if (body.gemstonePrices) {
      settings.pricingFactors.gemstonePrices = new Map(Object.entries(body.gemstonePrices));
    }
    if (body.purityMultipliers) {
      settings.pricingFactors.purityMultipliers = new Map(Object.entries(body.purityMultipliers));
    }

    await settings.save();

    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/admin/pricing');
    } catch (e) {
      console.error("Revalidation error:", e);
    }

    return NextResponse.json({ success: true, data: settings.pricingFactors });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
