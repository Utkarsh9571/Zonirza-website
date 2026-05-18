import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const settings = await Settings.findOne();
    
    if (!settings) {
      return NextResponse.json({ success: true, data: {} });
    }

    // Only return public fields
    const publicSettings = {
      siteName: settings.siteName,
      supportEmail: settings.supportEmail,
      supportPhone: settings.supportPhone,
      address: settings.address,
      businessHours: settings.businessHours,
      footerText: settings.footerText,
      maintenanceMode: settings.maintenanceMode,
      socialLinks: settings.socialLinks,
      contactPage: settings.contactPage,
      seo: settings.seo,
      announcement: settings.announcement,
      pricingFactors: {
        freeShippingThreshold: settings.pricingFactors?.freeShippingThreshold || 5000
      }
    };

    return NextResponse.json({ success: true, data: publicSettings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
