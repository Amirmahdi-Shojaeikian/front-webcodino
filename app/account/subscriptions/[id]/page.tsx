"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { use } from "react";
import type { Subscription } from "../data";

export default function SubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [sub, setSub] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/account/subscriptions/${id}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (alive) setSub(data?.item ?? null);
        } else if (alive) {
          setSub(null);
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
  if (!sub) {
    return (
      <section className="py-10">
        <h1 className="text-2xl font-bold mb-3">اشتراک پیدا نشد</h1>
        <Link href="/account/subscriptions" className="text-blue-600 hover:underline">بازگشت به اشتراک‌ها</Link>
      </section>
    );
  }
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">جزئیات اشتراک {sub.id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-2">مشخصات</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>خدمت</span><span>{sub.service}</span></li>
            <li className="flex justify-between"><span>پلن</span><span>{sub.plan}</span></li>
            <li className="flex justify-between"><span>مبلغ</span><span>{sub.price}</span></li>
            <li className="flex justify-between"><span>دوره</span><span>{sub.period}</span></li>
            <li className="flex justify-between"><span>وضعیت</span><span>{sub.status}</span></li>
            <li className="flex justify-between"><span>تاریخ شروع</span><span>{sub.startDate}</span></li>
            <li className="flex justify-between"><span>تاریخ پایان</span><span>{sub.endDate}</span></li>
          </ul>
        </div>
        <div className="border rounded-xl p-5 space-y-3">
          <h2 className="text-lg font-semibold">تمدید/مدیریت</h2>
          <button className="rounded-xl bg-blue-600 text-white px-5 py-2 text-base hover:bg-blue-700">تمدید اشتراک</button>
          <p className="text-sm text-foreground/70">با کلیک روی «تمدید اشتراک» به درگاه پرداخت و مراحل تمدید هدایت می‌شوید.</p>
        </div>
      </div>
      <div>
        <Link href="/account/subscriptions" className="inline-block rounded-lg border px-4 py-2 hover:bg-blue-600 hover:text-white">بازگشت</Link>
      </div>
    </section>
  );
}


