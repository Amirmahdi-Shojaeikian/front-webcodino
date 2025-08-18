import { NextResponse } from "next/server";
import { coupons, type Coupon } from "@/app/account/coupons/data";

// GET /api/account/coupons
export async function GET() {
  const items: Coupon[] = coupons;
  return NextResponse.json({ items });
}


