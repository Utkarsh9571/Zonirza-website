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
        freeShippingThreshold: settings.pricingFactors?.freeShippingThreshold || 5000,
        gstPercentage: settings.pricingFactors?.gstPercentage || 3,
        shippingBaseCharge: settings.pricingFactors?.shippingBaseCharge || 0,
        metalRates: settings.pricingFactors?.metalRates || { gold24k: 6500, silver: 100, platinum: 4000 },
        stonePrices: settings.pricingFactors?.stonePrices ? Object.fromEntries(settings.pricingFactors.stonePrices) : undefined,
        purityMultipliers: settings.pricingFactors?.purityMultipliers ? Object.fromEntries(settings.pricingFactors.purityMultipliers) : undefined,
        sizeWeightOffset: settings.pricingFactors?.sizeWeightOffset
      }
    };

    return NextResponse.json({ success: true, data: publicSettings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
