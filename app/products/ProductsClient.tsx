"use client";

import { useEffect, useMemo, useState } from "react";
import NoScroll from "@/components/NoScroll";
import Link from "next/link";
import type { Product } from "./data";

const categoryToSubcategories: Record<string, string[]> = {
  "سایت": ["سایت شرکتی", "فروشگاهی", "پزشکی", "وبلاگی", "رزومه‌ای"],
  "اپلیکیشن": ["اپلیکیشن فروشگاهی", "اپلیکیشن خدماتی", "اپلیکیشن پزشکی", "اپلیکیشن شرکتی"],
  "ربات": ["ربات تلگرام", "ربات اینستاگرام", "ربات بله"],
  "تولید محتوا": [
    "لیست خدمات شرکت تولید محتوا (سوشیال مدیا + عکاسی)",
    "پکیج‌های مدیریت و تولید محتوا",
    "پکیج‌های عکاسی و ادیت",
    "پکیج‌های ویدیو و ریلز",
    "پکیج‌های خدمات جانبی"
  ],
};

const disabledCategories = ["هاست", "سرور"];

const categoryColors: Record<string, string> = {
  "سایت شرکتی": "🟦",
  "فروشگاهی": "🟩",
  "پزشکی": "🟨",
  "وبلاگی": "🟪",
  "رزومه‌ای": "🟫",
  "اپلیکیشن فروشگاهی": "🟦",
  "اپلیکیشن خدماتی": "🟩",
  "اپلیکیشن پزشکی": "🟨",
  "اپلیکیشن شرکتی": "🟪",
  "ربات تلگرام": "🟦",
  "ربات اینستاگرام": "🟩",
  "ربات بله": "🟨",
};

export default function ProductsClient({ items }: { items: Product[] }) {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const handle = () => setIsDesktop(window.innerWidth >= 768);
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Record<string, Set<string>>>(() => {
    const initial: Record<string, Set<string>> = {};
    Object.keys(categoryToSubcategories).forEach((c) => (initial[c] = new Set()));
    return initial;
  });

  const [products] = useState<Product[]>(items);

  const selectedSubSet = useMemo(() => {
    const set = new Set<string>();
    Object.values(selected).forEach((s) => s.forEach((x) => set.add(x)));
    return set;
  }, [selected]);

  const filteredProducts = useMemo(() => {
    if (selectedSubSet.size === 0) return products;
    return products.filter(p => selectedSubSet.has(p.subcategory));
  }, [products, selectedSubSet]);

  function toggleCategoryOpen(category: string) {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  }

  function toggleSubcategory(category: string, sub: string) {
    setSelected((prev) => {
      const copy: Record<string, Set<string>> = { ...prev };
      const set = new Set(copy[category]);
      if (set.has(sub)) set.delete(sub);
      else set.add(sub);
      copy[category] = set;
      return copy;
    });
  }

  return (
    <section className="mt-6 sm:mt-8">
      {isDesktop && <NoScroll />}
      <div className="grid grid-cols-1 md:grid-cols-[18%_82%] gap-6">
        <aside className="border rounded-2xl p-5 order-1 md:order-none md:h-[70vh] md:overflow-y-auto [direction:rtl] bg-background/20 backdrop-blur-sm">
          <div className="[direction:rtl]">
            <h2 className="text-xl font-bold mb-4">فیلتر محصولات</h2>
            <div className="flex flex-col">
              {Object.entries(categoryToSubcategories).map(([category, subs]) => {
                const isOpen = !!openCategories[category];
                const selectedCount = selected[category]?.size ?? 0;
                return (
                  <div key={category} className="border-b last:border-b-0 py-2">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between text-right text-base sm:text-lg px-1 py-2 hover:text-blue-600"
                      onClick={() => toggleCategoryOpen(category)}
                      aria-expanded={isOpen}
                      aria-controls={`sub-${category}`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{category}</span>
                        {selectedCount > 0 && (
                          <span className="text-xs rounded-full bg-blue-100 text-blue-700 px-2 py-0.5">
                            {selectedCount}
                          </span>
                        )}
                      </span>
                      <span className={`transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}>▾</span>
                    </button>
                    {isOpen && (
                      <div id={`sub-${category}`} className="mt-2 pr-3 flex flex-col gap-2">
                        {subs.map((sub) => {
                          const checked = selected[category]?.has(sub) ?? false;
                          const emoji = (category === "سایت" || category === "اپلیکیشن" || category === "ربات") ? "" : (categoryColors[sub] || "");
                          return (
                            <label key={sub} className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
                              <input
                                type="checkbox"
                                className="size-4 accent-blue-600"
                                checked={checked}
                                onChange={() => toggleSubcategory(category, sub)}
                              />
                              <span>{emoji} {sub}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {disabledCategories.map((category) => (
                <div key={category} className="border-b last:border-b-0 py-2">
                  <div className="w-full flex items-center justify-between text-right text-base sm:text-lg px-1 py-2 text-gray-400 cursor-not-allowed">
                    <span className="flex items-center gap-2">
                      <span>{category}</span>
                      <span className="text-xs rounded-full bg-gray-100 text-gray-500 px-2 py-0.5">به زودی</span>
                    </span>
                    <span className="text-gray-400">▾</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="order-2 md:order-none border rounded-2xl p-5 md:h-[70vh] md:overflow-y-auto md:[direction:rtl] bg-background/20 backdrop-blur-sm">
          <div className="[direction:rtl] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {filteredProducts.map((p) => {
              let emoji = "🚀";
              if (p.title && p.title.includes("پایه")) emoji = "⭐";
              else if (p.title && p.title.includes("حرفه‌ای")) emoji = "🔥";
              else if (p.title && p.title.includes("ویژه")) emoji = "👑";
              return (
                <article key={p.id} className="h-full min-h-56 border rounded-2xl p-4 bg-background flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{emoji}</span>
                    <h3 className="text-xl font-bold">{p.title}</h3>
                  </div>
                  <div className="text-foreground/70 text-base mb-4">
                    {p.desc.split(' ').slice(0, 5).join(' ')}...
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-end">
                    <Link href={`/products/${p.id}`} className="rounded-xl border px-3 py-2 text-base hover:bg-blue-600 hover:text-white">
                      توضیحات
                    </Link>
                  </div>
                </article>
              );
            })}
            {filteredProducts.length === 0 && (
              <div className="col-span-3 text-center text-foreground/70 py-10">محصولی مطابق فیلترها یافت نشد.</div>
            )}
          </div>
        </main>
      </div>
    </section>
  );
}


