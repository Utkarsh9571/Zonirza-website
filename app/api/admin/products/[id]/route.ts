import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

interface AdminSession extends Session {
  user: Session["user"] & { role?: string };
}

function isAdminSession(session: Session | null): boolean {
  return !!(session as AdminSession | null)?.user?.role && (session as AdminSession).user.role === "admin";
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unexpected error occurred";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!isAdminSession(session)) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: unknown) {
    console.error("Admin Product Detail Error:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!isAdminSession(session)) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json() as Record<string, unknown>;

    const product = await Product.findByIdAndUpdate(id, body, { new: true });

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath(`/product/${product.slug}`);
      revalidatePath(`/category/${product.category}`);
    } catch (e) {
      console.error("Revalidation error:", e);
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: unknown) {
    console.error("Admin Product Update Error:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!isAdminSession(session)) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath(`/product/${product.slug}`);
      revalidatePath(`/category/${product.category}`);
    } catch (e) {
      console.error("Revalidation error:", e);
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: unknown) {
    console.error("Admin Product Delete Error:", error);
    return NextResponse.json({ success: false, message: getErrorMessage(error) }, { status: 500 });
  }
}
