import { NextResponse } from "next/server";

export type CartItem = {
  id: string;
  product: string;
  type: string;
  unitPrice: number; // تومان
};

const cartItems: CartItem[] = [
  { id: "C-101", product: "هاست ایرانی پایه", type: "هاست", unitPrice: 50000 },
  { id: "C-102", product: "سرور خارجی اختصاصی", type: "سرور", unitPrice: 900000 },
  { id: "C-103", product: "طراحی سایت فروشگاهی", type: "سایت", unitPrice: 2000000 },
];

// GET /api/account/cart
export async function GET() {
  return NextResponse.json({ items: cartItems });
}

// DELETE /api/account/cart?id=C-101
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id_required" }, { status: 400 });
  // اینجا حذف واقعی انجام می‌شود
  return NextResponse.json({ ok: true });
}


