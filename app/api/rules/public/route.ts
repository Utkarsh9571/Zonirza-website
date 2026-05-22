import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ConfigurationRule from "@/models/ConfigurationRule";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Fetch only active rules for the storefront
    const rules = await ConfigurationRule.find({ isActive: true });
    
    return NextResponse.json({ success: true, data: rules });
  } catch (error: any) {
    console.error("Fetch Public Rules Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
