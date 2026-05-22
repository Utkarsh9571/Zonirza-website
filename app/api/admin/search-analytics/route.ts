import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import SearchAnalytics from "@/models/SearchAnalytics";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Top 20 popular searches
    const popularSearches = await SearchAnalytics.find()
      .sort({ count: -1 })
      .limit(20);

    // Top 20 zero-result searches
    const zeroResultSearches = await SearchAnalytics.find({ isZeroResult: true })
      .sort({ count: -1 })
      .limit(20);

    return NextResponse.json({ 
      success: true, 
      popularSearches,
      zeroResultSearches
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
