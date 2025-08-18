import { NextResponse } from "next/server";
import { findOrderById } from "@/app/account/orders/data";

// GET /api/account/orders/:id
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = findOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json({ item: order });
}


