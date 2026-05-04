import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import FranchiseLead from '@/models/FranchiseLead';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const franchiseLead = await FranchiseLead.create(body);
    return NextResponse.json({ success: true, data: franchiseLead }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
