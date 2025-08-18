import { NextResponse } from "next/server";

type Project = {
  id: number;
  title: string;
  desc: string;
  category: string;
  subcategory: string;
  link?: string;
};

const items: Project[] = [
  { id: 1, title: "پروژه سایت فروشگاهی", desc: "راه‌اندازی فروش آنلاین", category: "سایت", subcategory: "فروشگاهی", link: "/projects" },
];

// GET /api/admin/projects
export async function GET() {
  return NextResponse.json({ items });
}


