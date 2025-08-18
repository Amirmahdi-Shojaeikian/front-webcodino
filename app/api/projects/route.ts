import { NextResponse } from "next/server";
import { allProjects, type Project } from "@/app/projects/data";

// GET /api/projects?subcategories=a,b,c
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subParam = searchParams.get("subcategories");
  let items: Project[] = allProjects;

  if (subParam) {
    const wanted = new Set(
      subParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
    items = allProjects.filter((p) => wanted.has(p.subcategory));
  }

  return NextResponse.json({ items });
}


