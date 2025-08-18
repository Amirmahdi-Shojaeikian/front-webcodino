import { NextResponse } from "next/server";
import type { OrderRow } from "@/app/account/orders/data";
import { orders as seedOrders } from "@/app/account/orders/data";

type AdminOrderRow = OrderRow & { userName: string; userNationalId: string };

// GET /api/admin/orders
export async function GET() {
  const sampleUsers = ["علی رضایی", "نگار محمدی", "پارسا صالحی", "سارا احمدی"]; 
  const sampleNationalIds = ["0012345678", "1234567890", "0987654321", "1122334455"]; 
  const items: AdminOrderRow[] = seedOrders.map((o, idx) => ({
    ...o,
    userName: sampleUsers[idx % sampleUsers.length],
    userNationalId: sampleNationalIds[idx % sampleNationalIds.length],
  }));
  return NextResponse.json({ items });
}


