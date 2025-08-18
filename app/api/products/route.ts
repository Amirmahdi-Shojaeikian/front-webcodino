import { NextResponse } from "next/server";
import { allProducts, type Product } from "@/app/products/data";

// GET /api/products?subcategories=a,b,c
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subParam = searchParams.get("subcategories");
  let items: Product[] = allProducts;

  if (subParam) {
    const wanted = new Set(
      subParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
    items = allProducts.filter((p) => wanted.has(p.subcategory));
  }

  return NextResponse.json({ items });
}


