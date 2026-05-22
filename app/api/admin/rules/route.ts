import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ConfigurationRule from "@/models/ConfigurationRule";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const rules = await ConfigurationRule.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: rules });
  } catch (error: any) {
    console.error("Fetch Rules Error:", error);
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
    
    const newRule = new ConfigurationRule(body);
    await newRule.save();

    return NextResponse.json({ success: true, data: newRule });
  } catch (error: any) {
    console.error("Create Rule Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
