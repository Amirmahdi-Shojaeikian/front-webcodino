import { NextResponse } from "next/server";

// POST /api/account/register
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (!body?.email || !body?.password) return NextResponse.json({ error: "invalid" }, { status: 400 });
  // اینجا ثبت‌نام واقعی انجام می‌شود
  return NextResponse.json({ ok: true, userId: "U-1" }, { status: 201 });
}


