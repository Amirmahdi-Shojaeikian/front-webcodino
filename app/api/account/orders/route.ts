import { NextResponse } from "next/server";
import { orders, type OrderRow } from "@/app/account/orders/data";

// GET /api/account/orders
export async function GET() {
  const items: OrderRow[] = orders;
  return NextResponse.json({ items });
}


