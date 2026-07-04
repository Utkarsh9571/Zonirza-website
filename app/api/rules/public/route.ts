import { NextRequest, NextResponse } from "next/server";
import { tryDbConnect } from "@/lib/db";
import ConfigurationRule from "@/models/ConfigurationRule";
import { MOCK_RULES } from "@/lib/mockData";

export async function GET(req: NextRequest) {
  try {
    const connected = await tryDbConnect();
    if (!connected) {
      return NextResponse.json({ success: true, data: MOCK_RULES, _demo: true });
    }
    
    // Fetch only active rules for the storefront
    const rules = await ConfigurationRule.find({ isActive: true });
    
    return NextResponse.json({ success: true, data: rules });
  } catch (error: any) {
    console.error("Fetch Public Rules Error:", error);
    return NextResponse.json({ success: true, data: MOCK_RULES, _demo: true });
  }
}

