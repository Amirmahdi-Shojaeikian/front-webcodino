import { NextResponse } from "next/server";

// POST /api/account/change-password
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const current = String(body.current ?? "");
  const next = String(body.next ?? "");
  if (!current || !next) return NextResponse.json({ error: "invalid" }, { status: 400 });
  // در اینجا رمز عبور کاربر را تغییر دهید
  return NextResponse.json({ ok: true });
}


