import { NextResponse } from "next/server";
import { subscriptions, type Subscription } from "@/app/account/subscriptions/data";

// GET /api/account/subscriptions
export async function GET() {
  const items: Subscription[] = subscriptions;
  return NextResponse.json({ items });
}


