"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { OrderRow } from "./data";

export default function OrdersPage() {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/account/orders", { cache: "no-store" });
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

  const statsCards = [
    { label: "کل سفارشات", count: rows.length },
    { label: "سفارشات فعال", count: rows.filter(row => row.status === "فعال").length },
    { label: "سفارشات تکمیل شده", count: rows.filter(row => row.status === "تکمیل شده").length },
    { label: "سفارشات در انتظار", count: rows.filter(row => row.status === "در انتظار").length },
  ];

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">سفارشات</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <div key={stat.label} className="bg-background border rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stat.count}</div>
            <div className="text-sm text-foreground/70">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="border rounded-xl [direction:ltr] bg-background">
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="[direction:rtl] overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-primary/10 text-foreground/80">
                <tr>
                  <th className="p-3 text-right">کد سفارش</th>
                  <th className="p-3 text-right">تاریخ</th>
                  <th className="p-3 text-right">اقلام</th>
                  <th className="p-3 text-right">مبلغ</th>
                  <th className="p-3 text-right">وضعیت</th>
                  <th className="p-3 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td className="p-3 text-center" colSpan={6}>در حال بارگذاری...</td></tr>
                )}
                {!isLoading && rows.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="p-3">{row.id}</td>
                    <td className="p-3">{row.date}</td>
                    <td className="p-3">{row.items}</td>
                    <td className="p-3">{row.amount}</td>
                    <td className="p-3">{row.status}</td>
                    <td className="p-3">
                      <Link href={`/account/orders/${row.id}`} className="rounded border px-3 py-1 hover:bg-primary hover:text-white">جزئیات</Link>
                    </td>
                  </tr>
                ))}
                {!isLoading && rows.length === 0 && (
                  <tr><td className="p-3 text-center text-foreground/70" colSpan={6}>سفارشی یافت نشد.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}


