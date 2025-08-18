import { NextResponse } from "next/server";

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: "ادمین" | "کاربر" | "پشتیبان";
  status: "فعال" | "غیرفعال" | "مسدود";
  createdAt: string;
};

const users: AdminUserRow[] = [
  { id: "U-1001", name: "علی رضایی", email: "ali@example.com", role: "ادمین", status: "فعال", createdAt: "1403/01/12" },
  { id: "U-1002", name: "نگار محمدی", email: "negar@example.com", role: "کاربر", status: "فعال", createdAt: "1403/02/03" },
  { id: "U-1003", name: "پارسا صالحی", email: "parsa@example.com", role: "پشتیبان", status: "غیرفعال", createdAt: "1403/02/20" },
  { id: "U-1004", name: "سارا احمدی", email: "sara@example.com", role: "کاربر", status: "مسدود", createdAt: "1403/03/01" },
];

// GET /api/admin/users
export async function GET() {
  return NextResponse.json({ items: users });
}

// POST /api/admin/users
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id = `U-${Math.floor(Math.random() * 100000)}`;
  const row: AdminUserRow = {
    id,
    name: body?.name ?? "",
    email: body?.email ?? "",
    role: body?.role ?? "کاربر",
    status: body?.status ?? "فعال",
    createdAt: body?.createdAt ?? "1403/01/01",
  };
  return NextResponse.json({ item: row }, { status: 201 });
}


