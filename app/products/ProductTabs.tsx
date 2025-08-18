"use client";

import { useState } from "react";
import type { Product } from "./data";

type Props = {
  product: Product;
  compareWith?: Product[];
  showCompare?: boolean;
};

export default function ProductTabs({ product, compareWith = [], showCompare = true }: Props) {
  const [tab, setTab] = useState<"info" | "compare">("info");

  return (
    <div className="border rounded-2xl p-4 bg-background">
      {showCompare ? (
        <div className="flex gap-2 mb-4">
          <button
            className={`rounded-lg px-4 py-2 text-sm border transition-colors ${
              tab === "info" ? "bg-blue-600 text-white border-blue-600" : "hover:bg-blue-50"
            }`}
            onClick={() => setTab("info")}
          >
            اطلاعات محصول
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm border transition-colors ${
              tab === "compare" ? "bg-blue-600 text-white border-blue-600" : "hover:bg-blue-50"
            }`}
            onClick={() => setTab("compare")}
          >
            مقایسه
          </button>
        </div>
      ) : (
        <h2 className="text-lg font-semibold mb-3">اطلاعات محصول</h2>
      )}

      {tab === "info" && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <tbody>
              <tr className="border-b"><td className="p-3 text-foreground/70">عنوان</td><td className="p-3">{product.title}</td></tr>
              <tr className="border-b"><td className="p-3 text-foreground/70">دسته</td><td className="p-3">{product.category}</td></tr>
              <tr className="border-b"><td className="p-3 text-foreground/70">زیر‌دسته</td><td className="p-3">{product.subcategory}</td></tr>

              {product.storage && (
                <tr className="border-b"><td className="p-3 text-foreground/70">فضای میزبانی</td><td className="p-3">{product.storage}</td></tr>
              )}
              {product.bandwidth && (
                <tr className="border-b"><td className="p-3 text-foreground/70">پهنای باند</td><td className="p-3">{product.bandwidth}</td></tr>
              )}
              {product.uptime && (
                <tr className="border-b"><td className="p-3 text-foreground/70">آپتایم</td><td className="p-3">{product.uptime}</td></tr>
              )}
              {product.panel && (
                <tr className="border-b"><td className="p-3 text-foreground/70">کنترل پنل</td><td className="p-3">{product.panel}</td></tr>
              )}
              {product.ssl && (
                <tr className="border-b"><td className="p-3 text-foreground/70">SSL</td><td className="p-3">{product.ssl}</td></tr>
              )}
              {product.backups && (
                <tr className="border-b"><td className="p-3 text-foreground/70">بکاپ</td><td className="p-3">{product.backups}</td></tr>
              )}
              <tr><td className="p-3 text-foreground/70 align-top">توضیحات</td><td className="p-3 leading-7">{product.desc}</td></tr>
            </tbody>
          </table>
        </div>
      )}

      {showCompare && tab === "compare" && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-foreground/5 text-foreground/80">
              <tr>
                <th className="p-3 text-right">ویژگی</th>
                <th className="p-3 text-right">{product.title}</th>
                {compareWith.map((p) => (
                  <th key={p.id} className="p-3 text-right">{p.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">دسته</td>
                <td className="p-3">{product.category}</td>
                {compareWith.map((p) => (
                  <td key={p.id} className="p-3">{p.category}</td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-3">زیر‌دسته</td>
                <td className="p-3">{product.subcategory}</td>
                {compareWith.map((p) => (
                  <td key={p.id} className="p-3">{p.subcategory}</td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


