"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { use } from "react";
import type { OrderRow } from "../data";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/account/orders/${id}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (alive) setOrder(data?.item ?? null);
        } else if (alive) {
          setOrder(null);
        }
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);
  if (isLoading) {
    return (
      <section className="py-10">
        <div className="text-center text-foreground/70">در حال بارگذاری...</div>
      </section>
    );
  }
  if (!order) {
    return (
      <section className="py-10">
        <h1 className="text-2xl font-bold mb-3">سفارش پیدا نشد</h1>
        <Link href="/account/orders" className="text-blue-600 hover:underline">بازگشت به سفارشات</Link>
      </section>
    );
  }
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">جزئیات سفارش {order.id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-2">مشخصات سفارش</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>تاریخ</span><span>{order.date}</span></li>
            <li className="flex justify-between"><span>اقلام</span><span>{order.items}</span></li>
            <li className="flex justify-between"><span>مبلغ</span><span>{order.amount}</span></li>
            <li className="flex justify-between"><span>وضعیت</span><span>{order.status}</span></li>
          </ul>
        </div>
        <div className="border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-2">پیگیری و پشتیبانی</h2>
          <p className="text-sm text-foreground/70 mb-3">در صورت نیاز به پشتیبانی، از طریق تیکت یا تماس با ما در ارتباط باشید.</p>
          <div className="flex gap-2">
            <Link href="/account/tickets" className="rounded border px-3 py-2 hover:bg-blue-600 hover:text-white">ثبت تیکت</Link>
            <Link href="/contact" className="rounded border px-3 py-2 hover:bg-blue-600 hover:text-white">تماس با ما</Link>
          </div>
        </div>
      </div>
      <div>
        <Link href="/account/orders" className="inline-block rounded-lg border px-4 py-2 hover:bg-blue-600 hover:text-white">بازگشت</Link>
      </div>
    </section>
  );
}


