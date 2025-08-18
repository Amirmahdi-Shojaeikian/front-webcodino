import { NextResponse } from "next/server";
import { findSubscriptionById } from "@/app/account/subscriptions/data";

// GET /api/account/subscriptions/:id
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const sub = findSubscriptionById(params.id);
  if (!sub) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json({ item: sub });
}


