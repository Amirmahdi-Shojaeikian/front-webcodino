"use client";

import { useEffect, useMemo, useState } from "react";
import type { Coupon } from "@/app/account/coupons/data";
import { allProducts } from "@/app/products/data";

type CouponForm = {
  code: string;
  title: string;
  amount: string; // درصد یا مبلغ ثابت
  expireAt: string; // تاریخ شمسی
  status: "فعال" | "منقضی" | "استفاده شده";
  // وابستگی به محصول/دسته اختیاری
  productId?: number; // در صورت نیاز به اعمال روی محصول خاص
  category?: string; // یا اعمال روی دسته
};

export default function AdminCouponsPage() {
  type AdminCoupon = Coupon & { productId?: number; category?: string };
  const [rows, setRows] = useState<AdminCoupon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("همه");
  const [categoryFilter, setCategoryFilter] = useState<string>("همه");
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<CouponForm>({ code: "", title: "", amount: "", expireAt: "", status: "فعال" });
  const [editingCode, setEditingCode] = useState<string | null>(null);

  const products = allProducts; // در آینده از API محصولات لود شود
  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);

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
    return () => { alive = false; };
  }, []);

  function handleChange<K extends keyof CouponForm>(key: K, value: CouponForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm({ code: "", title: "", amount: "", expireAt: "", status: "فعال", productId: undefined, category: undefined });
    setShowAddForm(false);
    setEditingCode(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code.trim() || !form.title.trim() || !form.amount.trim() || !form.expireAt.trim()) {
      alert("فیلدهای الزامی را تکمیل کنید.");
      return;
    }
    const newRow: AdminCoupon = {
      code: form.code.trim(),
      title: form.title.trim(),
      amount: form.amount.trim(),
      expireAt: form.expireAt.trim(),
      status: form.status,
      productId: form.productId,
      category: form.category,
    };
    if (editingCode) {
      setRows((prev) => prev.map((r) => (r.code === editingCode ? newRow : r)));
      setEditingCode(null);
      resetForm();
    } else {
      // درج
      setRows((prev) => [newRow, ...prev]);
      resetForm();
    }
  }

  function startEdit(c: AdminCoupon) {
    setForm({
      code: c.code,
      title: c.title,
      amount: c.amount,
      expireAt: c.expireAt,
      status: c.status,
      productId: c.productId,
      category: c.category,
    });
    setEditingCode(c.code);
  }

  // فیلتر کردن کدهای تخفیف
  const filteredCoupons = useMemo(() => {
    return rows.filter((coupon) => {
      const matchesSearch = 
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.amount.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "همه" || coupon.status === statusFilter;
      const matchesCategory = categoryFilter === "همه" || coupon.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [rows, searchTerm, statusFilter, categoryFilter]);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">مدیریت کدهای تخفیف</h1>
        <button
          className="rounded-xl bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
          onClick={() => setShowAddForm(true)}
        >
          افزودن کد تخفیف
        </button>
      </div>

      {/* فیلترها و جستجو */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm mb-1">جستجو</label>
          <input
            type="text"
            placeholder="جستجو در کد، عنوان یا میزان تخفیف..."
            className="w-full rounded-lg border px-3 py-2 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">وضعیت</label>
          <select
            className="w-full rounded-lg border px-3 py-2 bg-background [&>option]:bg-black [&>option]:text-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="همه">همه</option>
            <option value="فعال">فعال</option>
            <option value="منقضی">منقضی</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">دسته</label>
          <select
            className="w-full rounded-lg border px-3 py-2 bg-background [&>option]:bg-black [&>option]:text-white"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="همه">همه</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("همه");
              setCategoryFilter("همه");
            }}
            className="w-full rounded-lg border px-3 py-2 bg-background hover:bg-blue-600 hover:text-white"
          >
            پاک کردن فیلترها
          </button>
        </div>
      </div>

      {/* فرم ایجاد/ویرایش کوپن */}
      {(showAddForm || editingCode) && (
        <form onSubmit={handleSubmit} className="border rounded-2xl p-5 space-y-4 bg-background">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">{editingCode ? "ویرایش کد تخفیف" : "افزودن کد تخفیف"}</h2>
          <button type="button" onClick={resetForm} className="rounded border px-3 py-1 hover:bg-blue-600 hover:text-white">بستن فرم</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">کد (الزامی)</label>
            <input className="w-full rounded border px-3 py-2 bg-background" value={form.code} onChange={(e) => handleChange("code", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">عنوان (الزامی)</label>
            <input className="w-full rounded border px-3 py-2 bg-background" value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">میزان تخفیف (الزامی)</label>
            <input className="w-full rounded border px-3 py-2 bg-background" placeholder="مثال: ۱۰٪ یا ۵۰,۰۰۰ تومان" value={form.amount} onChange={(e) => handleChange("amount", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">تاریخ انقضا (الزامی)</label>
            <input className="w-full rounded border px-3 py-2 bg-background" placeholder="مثال: 1403/06/30" value={form.expireAt} onChange={(e) => handleChange("expireAt", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">وضعیت</label>
            <select className="w-full rounded border px-3 py-2 bg-background" value={form.status} onChange={(e) => handleChange("status", e.target.value as CouponForm["status"]) }>
              <option value="فعال">فعال</option>
              <option value="منقضی">منقضی</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">اعمال روی محصول خاص (اختیاری)</label>
            <select className="w-full rounded border px-3 py-2 bg-background" value={form.productId ?? ""} onChange={(e) => handleChange("productId", e.target.value ? Number(e.target.value) : undefined)}>
              <option value="">— انتخاب کنید —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">یا اعمال روی دسته (اختیاری)</label>
            <select className="w-full rounded border px-3 py-2 bg-background" value={form.category ?? ""} onChange={(e) => handleChange("category", e.target.value || undefined)}>
              <option value="">— انتخاب کنید —</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end">
          {editingCode && (
            <button type="button" className="rounded border px-4 py-2 hover:bg-blue-600 hover:text-white" onClick={() => { resetForm(); setEditingCode(null); }}>لغو ویرایش</button>
          )}
          <button type="submit" className="rounded bg-blue-600 text-white px-5 py-2 hover:bg-blue-700">{editingCode ? "ذخیره تغییرات" : "ثبت کوپن"}</button>
        </div>
        </form>
      )}

      {/* جدول کوپن‌ها */}
      <div className="border rounded-xl [direction:ltr] bg-background">
        <div className="max-h-[60vh] overflow-y-auto pr-2 [scrollbar-gutter:stable]">
          <div className="[direction:rtl] overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-foreground/5 text-foreground/80">
                <tr>
                  <th className="p-3 text-right">کد</th>
                  <th className="p-3 text-right">عنوان</th>
                  <th className="p-3 text-right">میزان تخفیف</th>
                  <th className="p-3 text-right">انقضا</th>
                  <th className="p-3 text-right">وضعیت</th>
                  <th className="p-3 text-right">اعمال روی</th>
                  <th className="p-3 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td className="p-3 text-center" colSpan={7}>در حال بارگذاری...</td></tr>
                )}
                {!isLoading && filteredCoupons.map((c) => {
                  const targetLabel = c.productId ? products.find(p => p.id === c.productId)?.title : c.category ?? "—";
                  return (
                    <tr key={c.code} className="border-t">
                      <td className="p-3">{c.code}</td>
                      <td className="p-3">{c.title}</td>
                      <td className="p-3">{c.amount}</td>
                      <td className="p-3">{c.expireAt}</td>
                      <td className="p-3">{c.status}</td>
                      <td className="p-3">{targetLabel}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button className="rounded border px-3 py-1 hover:bg-blue-600 hover:text-white" onClick={() => startEdit(c)}>ویرایش</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!isLoading && filteredCoupons.length === 0 && (
                  <tr><td className="p-3 text-center text-foreground/70" colSpan={7}>
                    {rows.length === 0 ? "کوپنی ثبت نشده است." : "نتیجه‌ای برای فیلترهای انتخابی یافت نشد."}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}


