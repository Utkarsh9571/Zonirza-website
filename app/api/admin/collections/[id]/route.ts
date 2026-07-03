import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Collection from "@/models/Collection";
import { revalidatePath } from "next/cache";

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
    const collection = await Collection.findByIdAndUpdate(id, body, { new: true });

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

export async function DELETE(
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
    const collection = await Collection.findByIdAndDelete(id);

    if (collection) {
      try {
        revalidatePath('/');
        revalidatePath('/products');
      } catch (e) {
        console.error("Revalidation error:", e);
      }
    }

    return NextResponse.json({ success: true, message: "Collection deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
