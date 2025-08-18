import { NextResponse } from "next/server";

export type Ticket = {
  id: string;
  subject: string;
  question: string;
  answer?: string;
  status: "پاسخ داده شد" | "در انتظار پاسخ";
  createdAt: string;
};

// موقت: داده نمونه داخل API
const tickets: Ticket[] = [
  { id: "T-1001", subject: "سوال درباره تمدید هاست", question: "سلام...", answer: "از بخش اشتراک‌ها...", status: "پاسخ داده شد", createdAt: "1403/05/12" },
  { id: "T-1002", subject: "مشکل لاگین", question: "بعد از تغییر رمز...", status: "در انتظار پاسخ", createdAt: "1403/05/18" },
];

// GET /api/account/tickets
export async function GET() {
  return NextResponse.json({ items: tickets });
}

// POST /api/account/tickets
export async function POST(req: Request) {
  await req.json().catch(() => ({}));
  // در اینجا می‌توانید اعتبارسنجی و ذخیره در دیتابیس را انجام دهید
  return NextResponse.json({ ok: true, id: "T-NEW" }, { status: 201 });
}


