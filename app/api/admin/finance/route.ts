import { NextResponse } from "next/server";

type FinanceTransaction = {
  id: string;
  date: string; // 1403/05/01
  userName: string;
  nationalId: string;
  kind: "واریز" | "برداشت";
  method: "آنلاین - ریالی" | "آنلاین - کیریپتو";
  amount: string; // "۱,۲۵۰,۰۰۰"
  status: "موفق" | "ناموفق" | "در انتظار";
  description?: string;
};

const items: FinanceTransaction[] = [
  { id: "TX-1001", date: "1403/05/01", userName: "علی رضایی", nationalId: "0012345678", kind: "واریز", method: "آنلاین - ریالی", amount: "۱,۲۵۰,۰۰۰", status: "موفق", description: "پرداخت سفارش ORD-1001" },
];

// GET /api/admin/finance
export async function GET() {
  return NextResponse.json({ items });
}


