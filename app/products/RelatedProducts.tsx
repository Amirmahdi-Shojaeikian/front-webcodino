"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "./data";

export default function RelatedProducts({ items, currentProduct }: { items: Product[]; currentProduct: Product }) {
  const [page, setPage] = useState(0);
  const pageSize = 4;
  
  // فیلتر کردن محصولات مرتبط بر اساس دسته‌بندی
  const relatedProducts = items.filter((p) => 
    p.id !== currentProduct.id && 
    p.category === currentProduct.category
  );
  
  const numPages = Math.ceil(relatedProducts.length / pageSize);
  const paged = relatedProducts.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {paged.map((p) => (
          <div key={p.id} className="border rounded-2xl p-6 bg-background flex flex-col h-full">
            <div className="font-semibold mb-2 text-lg">{p.title}</div>
            <div className="text-foreground/70 text-base mb-4 leading-6 flex-grow">{p.desc}</div>
            <div className="flex items-center justify-end mt-auto">
              <Link
                href={`/products/${p.id}`}
                className="rounded-lg border px-4 py-2 text-base cursor-pointer select-none touch-manipulation transition-colors duration-200 hover:bg-blue-600 hover:text-white active:bg-blue-700 active:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 whitespace-nowrap"
              >
                توضیحات
              </Link>
            </div>
          </div>
        ))}
      </div>
      {numPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: numPages }).map((_, i) => (
            <button
              key={i}
              className={`rounded-full w-10 h-10 border text-base ${i === page ? "bg-blue-600 text-white border-blue-600" : "hover:bg-blue-50"}`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


