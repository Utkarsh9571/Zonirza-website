import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Collection from "@/models/Collection";
import { revalidatePath } from "next/cache";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const collections = await Collection.find().sort({ createdAt: -1 });

    const enrichedCollections = await Promise.all(collections.map(async (col) => {
      const productCount = await Product.countDocuments({ tags: { $in: col.tags } });
      return {
        ...col.toObject(),
        productCount
      };
    }));

    return NextResponse.json({ success: true, data: enrichedCollections });
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
    const collection = await Collection.create(body);

    if (collection) {
      try {
        revalidatePath('/');
        revalidatePath('/products');
      } catch (e) {
        console.error("Revalidation error:", e);
      }
    }

    return NextResponse.json({ success: true, data: collection });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
