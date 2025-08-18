import { NextResponse } from "next/server";

type Ticket = {
  id: string;
  subject: string;
  question: string;
  answer?: string;
  status: "پاسخ داده شد" | "در انتظار پاسخ";
  createdAt: string;
};

type AdminTicket = Ticket & { userName: string };

const items: AdminTicket[] = [
  { id: "T-1001", subject: "سوال درباره تمدید هاست", question: "سلام...", answer: "از بخش اشتراک‌ها...", status: "پاسخ داده شد", createdAt: "1403/05/12", userName: "علی رضایی" },
];

// GET /api/admin/tickets
export async function GET() {
  return NextResponse.json({ items });
}


