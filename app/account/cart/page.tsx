"use client";

import type { CartItem } from "@/app/api/account/cart/route";
import { useEffect, useMemo, useState } from "react";

function formatPrice(toman: number) {
  return toman.toLocaleString("fa-IR") + " تومان";
}

export default function CartPage() {
  const [rows, setRows] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/account/cart", { cache: "no-store" });
        const data = await res.json();
        if (alive) setRows(Array.isArray(data?.items) ? data.items : []);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const total = useMemo(() => rows.reduce((sum, i) => sum + i.unitPrice, 0), [rows]);
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">سبد خرید</h1>
      <div className="border rounded-xl [direction:ltr] bg-background">
        <div className="max-h-[60vh] overflow-y-auto pr-2 [scrollbar-gutter:stable]">
          <div className="[direction:rtl] overflow-x-auto">
            <table className="min-w-full text-sm">
          <thead className="bg-foreground/5 text-foreground/80">
            <tr>
              <th className="p-3 text-right">کد</th>
              <th className="p-3 text-right">محصول</th>
              <th className="p-3 text-right">نوع</th>
              <th className="p-3 text-right">قیمت واحد</th>
              <th className="p-3 text-right">عملیات</th>
            </tr>
          </thead>
              <tbody>
            {isLoading && (
              <tr><td className="p-3 text-center" colSpan={5}>در حال بارگذاری...</td></tr>
            )}
            {!isLoading && rows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-3">{row.id}</td>
                <td className="p-3">{row.product}</td>
                <td className="p-3">{row.type}</td>
                <td className="p-3">{formatPrice(row.unitPrice)}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button className="rounded border px-3 py-1 hover:bg-blue-600 hover:text-white" onClick={async () => {
                      await fetch(`/api/account/cart?id=${row.id}`, { method: "DELETE" });
                      setRows((prev) => prev.filter((x) => x.id !== row.id));
                    }}>حذف</button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && rows.length === 0 && (
              <tr><td className="p-3 text-center text-foreground/70" colSpan={5}>سبد خرید خالی است.</td></tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t bg-foreground/5">
              <td className="p-3" colSpan={4}>
                جمع کل
              </td>
              <td className="p-3" colSpan={2}>
                {formatPrice(total)}
              </td>
            </tr>
          </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* بخش تکمیل سفارش */}
      {!isLoading && rows.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">تکمیل سفارش</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 border rounded-xl p-5 bg-background">
              <h3 className="text-lg font-semibold mb-3">اطلاعات پرداخت</h3>
              <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">نام و نام خانوادگی</label>
                  <input className="w-full rounded-lg border px-3 py-2 bg-transparent" placeholder="مثال: علی رضایی" />
                </div>
                <div>
                  <label className="block text-sm mb-1">ایمیل</label>
                  <input type="email" className="w-full rounded-lg border px-3 py-2 bg-transparent" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm mb-1">شماره تلفن</label>
                  <input className="w-full rounded-lg border px-3 py-2 bg-transparent" placeholder="0912xxxxxxx" />
                </div>
                <div>
                  <label className="block text-sm mb-1">کد ملی</label>
                  <input className="w-full rounded-lg border px-3 py-2 bg-transparent" placeholder="مثال: 0012345678" />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button className="rounded-xl bg-blue-600 text-white px-5 py-2 text-base hover:bg-blue-700">پرداخت</button>
                </div>
              </form>
            </div>
            <aside className="border rounded-xl p-5 h-max bg-background">
              <h3 className="text-lg font-semibold mb-3">خلاصه سفارش</h3>
              <ul className="space-y-2 text-sm">
                {rows.map((row) => (
                  <li key={row.id} className="flex justify-between">
                    <span>{row.product}</span>
                    <span>{formatPrice(row.unitPrice)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 border-t pt-3 flex justify-between font-bold">
                <span>جمع کل</span>
                <span>{formatPrice(total)}</span>
              </div>
            </aside>
          </div>
        </div>
      )}
    </section>
  );
}


