"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import NoScroll from "@/components/NoScroll";
import { faqs } from "./data";

export default function FAQPage() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const handle = () => setIsDesktop(window.innerWidth >= 768);
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return (
    <section className="mt-6 sm:mt-8">
      {isDesktop && <NoScroll />}
      <div className="grid grid-cols-1 md:grid-cols-[23%_77%] gap-6">
        {/* ستون چپ: لوگو، شعار، دکمه */}
        <aside className="border rounded-2xl p-5 md:h-[70vh] md:order-none order-2 flex flex-col items-center justify-start gap-3 pt-6 md:pt-8 bg-background/20 backdrop-blur-sm">
          <div className="flex items-center justify-center">
            <Image src="/logo.png" alt="لوگو وب‌کدینو" width={560} height={160} className="h-40 w-auto max-w-full" />
          </div>
          <p className="text-center text-base sm:text-lg text-foreground/80">
            با وب‌کدینو، ایده‌ات را به محصول دیجیتال موفق تبدیل کن.
          </p>
          <Link
            href="/contact"
            className="rounded-xl bg-primary text-white px-5 py-2 text-base sm:text-lg hover:bg-primary-light"
          >
            مشاوره رایگان
          </Link>
        </aside>

        {/* ستون راست: آکاردئون سوالات با اسکرول */}
        <main className="order-1 md:order-none border rounded-2xl p-5 h-auto md:h-[70vh] md:overflow-y-auto [direction:rtl] md:pr-3 bg-background/20 backdrop-blur-sm">
          <div className="[direction:rtl] space-y-3">
            {faqs.map((item) => (
              <details key={item.slug} className="border rounded-xl p-4 bg-background">
                <summary className="cursor-pointer text-base sm:text-lg font-semibold">
                  {item.question}
                </summary>
                <div className="mt-3 text-foreground/80 text-sm sm:text-base leading-7">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </main>
      </div>
    </section>
  );
}


