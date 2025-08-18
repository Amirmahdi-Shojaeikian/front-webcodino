import { NextResponse } from "next/server";

// POST /api/account/login
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { identifier, password } = body ?? {};
  if (!identifier || !password) return NextResponse.json({ error: "invalid" }, { status: 400 });
  // اینجا احراز هویت واقعی انجام می‌شود
  return NextResponse.json({ ok: true, token: "mock-token" });
}


