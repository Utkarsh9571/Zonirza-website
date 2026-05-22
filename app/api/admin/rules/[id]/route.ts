import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ConfigurationRule from "@/models/ConfigurationRule";

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

    const rule = await ConfigurationRule.findByIdAndUpdate(id, body, { new: true });

    if (!rule) {
      return NextResponse.json({ success: false, message: "Rule not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rule });
  } catch (error: any) {
    console.error("Update Rule Error:", error);
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

    const rule = await ConfigurationRule.findByIdAndDelete(id);

    if (!rule) {
      return NextResponse.json({ success: false, message: "Rule not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Rule deleted" });
  } catch (error: any) {
    console.error("Delete Rule Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
