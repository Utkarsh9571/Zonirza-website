import { NextResponse } from 'next/server'; import { authOptions } from '@/lib/auth'; export async function GET() { return NextResponse.json({ ok: true, keys: Object.keys(authOptions) }); }
