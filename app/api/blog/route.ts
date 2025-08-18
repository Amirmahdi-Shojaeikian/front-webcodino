import { NextResponse } from "next/server";
import { allPosts, type BlogPost } from "@/app/blog/data";

// GET /api/blog?subcategories=a,b,c
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subParam = searchParams.get("subcategories");
  let items: BlogPost[] = allPosts;

  if (subParam) {
    const wanted = new Set(
      subParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
    items = allPosts.filter((p) => wanted.has(p.subcategory));
  }

  return NextResponse.json({ items });
}


