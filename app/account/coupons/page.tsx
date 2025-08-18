"use client";

import type { Coupon } from "./data";
import { useEffect, useState } from "react";

export default function CouponsPage() {
  const [rows, setRows] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/account/coupons", { cache: "no-store" });
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
  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert("کد کپی شد: " + code);
    } catch {
      alert("امکان کپی خودکار نبود. لطفاً دستی کپی کنید.");
    }
  };
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">کدهای تخفیف</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-background border rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{rows.length}</div>
          <div className="text-sm text-foreground/70">کل کدهای تخفیف</div>
        </div>
        <div className="bg-background border rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{rows.filter(c => c.status === "فعال").length}</div>
          <div className="text-sm text-foreground/70">کدهای فعال</div>
        </div>
        <div className="bg-background border rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{rows.filter(c => c.status === "استفاده شده").length}</div>
          <div className="text-sm text-foreground/70">استفاده شده</div>
        </div>
        <div className="bg-background border rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{rows.filter(c => c.status === "منقضی شده").length}</div>
          <div className="text-sm text-foreground/70">منقضی شده</div>
        </div>
      </div>

      <div className="border rounded-xl [direction:ltr] bg-background">
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="[direction:rtl] overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-primary/10 text-foreground/80">
                <tr>
                  <th className="p-3 text-right">کد</th>
                  <th className="p-3 text-right">عنوان</th>
                  <th className="p-3 text-right">میزان تخفیف</th>
                  <th className="p-3 text-right">تاریخ انقضا</th>
                  <th className="p-3 text-right">وضعیت</th>
                  <th className="p-3 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td className="p-3 text-center" colSpan={6}>در حال بارگذاری...</td></tr>
                )}
                {!isLoading && rows.map((c) => (
                  <tr key={c.code} className="border-t">
                    <td className="p-3">{c.code}</td>
                    <td className="p-3">{c.title}</td>
                    <td className="p-3">{c.amount}</td>
                    <td className="p-3">{c.expireAt}</td>
                    <td className="p-3">{c.status}</td>
                    <td className="p-3">
                      <button onClick={() => copy(c.code)} className="rounded border px-3 py-1 hover:bg-primary hover:text-white">کپی کد</button>
                    </td>
                  </tr>
                ))}
                {!isLoading && rows.length === 0 && (
                  <tr><td className="p-3 text-center text-foreground/70" colSpan={6}>کدی یافت نشد.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}


