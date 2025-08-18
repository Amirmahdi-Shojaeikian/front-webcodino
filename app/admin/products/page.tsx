"use client";

import { useMemo, useState } from "react";
import type { Product as ProductEntity } from "@/app/products/data";
import { allProducts as seedProducts } from "@/app/products/data";

type Product = ProductEntity;

const categoryToSubcategories: Record<string, string[]> = {
  "هاست": ["هاست ایرانی", "هاست خارجی"],
  "سرور": ["سرور ایرانی", "سرور خارجی"],
  "سایت": ["فروشگاهی", "شرکتی", "پزشکی", "وبلاگ", "اختصاصی", "رزومه‌ای"],
  "اپلیکیشن": ["فروشگاهی", "پزشکی", "اختصاصی"],
  "ربات": ["تلگرام", "اینستاگرام", "بله"],
  "تولید محتوا": ["فتوشاپ", "تولید ویدیو", "محتوا نویسی"],
};

const categories = Object.keys(categoryToSubcategories);

export default function AdminProductsPage() {
  const [rows, setRows] = useState<Product[]>(seedProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("همه");
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>("همه");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({
    title: "",
    desc: "",
    category: "هاست",
    subcategory: "هاست ایرانی",
    price: "",
    storage: "",
    bandwidth: "",
    uptime: "",
    panel: "",
    ssl: "",
    backups: "",
    image: "",
  });

  const subcategories = useMemo(() => {
    return categoryToSubcategories[form.category || "هاست"] ?? [];
  }, [form.category]);

  function handleChange<K extends keyof Product>(key: K, value: Product[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm({
      title: "",
      desc: "",
      category: "هاست",
      subcategory: "هاست ایرانی",
      price: "",
      storage: "",
      bandwidth: "",
      uptime: "",
      panel: "",
      ssl: "",
      backups: "",
      image: "",
    });
    setShowAddForm(false);
    setEditingProduct(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const required: Array<keyof Product> = ["title", "category", "subcategory", "price"];
    for (const k of required) {
      const v = (form as any)[k];
      if (!v || String(v).trim() === "") {
        if (typeof window !== "undefined") alert("لطفاً فیلدهای الزامی را تکمیل کنید.");
        return;
      }
    }

    if (editingProduct) {
      // ویرایش محصول موجود
      const updatedProduct: Product = {
        ...editingProduct,
        title: form.title!.trim(),
        desc: (form.desc || "").trim(),
        category: form.category!,
        subcategory: form.subcategory!,
        price: form.price!,
        storage: form.storage?.trim() || undefined,
        bandwidth: form.bandwidth?.trim() || undefined,
        uptime: form.uptime?.trim() || undefined,
        panel: form.panel?.trim() || undefined,
        ssl: form.ssl?.trim() || undefined,
        backups: form.backups?.trim() || undefined,
        image: form.image?.trim() || undefined,
      };
      setRows((prev) => prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p)));
    } else {
      // افزودن محصول جدید
      const nextId = (rows.length ? Math.max(...rows.map((p) => p.id)) : 0) + 1;
      const newRow: Product = {
        id: nextId,
        title: form.title!.trim(),
        desc: (form.desc || "").trim(),
        category: form.category!,
        subcategory: form.subcategory!,
        price: form.price!,
        storage: form.storage?.trim() || undefined,
        bandwidth: form.bandwidth?.trim() || undefined,
        uptime: form.uptime?.trim() || undefined,
        panel: form.panel?.trim() || undefined,
        ssl: form.ssl?.trim() || undefined,
        backups: form.backups?.trim() || undefined,
        image: form.image?.trim() || undefined,
      };
      setRows((prev) => [newRow, ...prev]);
    }
    resetForm();
  }

  // فیلتر کردن محصولات
  const filteredProducts = useMemo(() => {
    return rows.filter((product) => {
      const matchesSearch = 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toString().includes(searchTerm);
      
      const matchesCategory = categoryFilter === "همه" || product.category === categoryFilter;
      const matchesSubcategory = subcategoryFilter === "همه" || product.subcategory === subcategoryFilter;
      
      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [rows, searchTerm, categoryFilter, subcategoryFilter]);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">مدیریت محصولات</h1>

      {/* فیلترها و جستجو */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm mb-1">جستجو</label>
          <input
            type="text"
            placeholder="جستجو در عنوان، توضیحات یا شناسه..."
            className="w-full rounded-lg border px-3 py-2 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
        <div>
          <label className="block text-sm mb-1">زیر دسته</label>
          <select
            className="w-full rounded-lg border px-3 py-2 bg-background [&>option]:bg-black [&>option]:text-white"
            value={subcategoryFilter}
            onChange={(e) => setSubcategoryFilter(e.target.value)}
          >
            <option value="همه">همه</option>
            {categoryFilter !== "همه" && categoryToSubcategories[categoryFilter]?.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("همه");
              setSubcategoryFilter("همه");
            }}
            className="flex-1 rounded-lg border px-3 py-2 bg-background hover:bg-blue-600 hover:text-white"
          >
            پاک کردن فیلترها
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex-1 rounded-lg bg-blue-600 text-white px-3 py-2 hover:bg-blue-700"
          >
            افزودن محصول
          </button>
        </div>
      </div>

      {/* فرم ایجاد/ویرایش محصول */}
      {(showAddForm || editingProduct) && (
        <form onSubmit={handleSubmit} className="border rounded-2xl p-5 space-y-4 bg-background">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">{editingProduct ? "ویرایش محصول" : "افزودن محصول"}</h2>
          <button type="button" onClick={resetForm} className="rounded border px-3 py-1 hover:bg-blue-600 hover:text-white">بستن فرم</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">عنوان (الزامی)</label>
            <input
              className="w-full rounded border px-3 py-2 bg-background"
              value={form.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">آدرس تصویر محصول (URL یا مسیر مثل /products/1.png)</label>
            <input
              className="w-full rounded border px-3 py-2 bg-background"
              placeholder="مثال: /products/1.png یا https://..."
              value={form.image || ""}
              onChange={(e) => handleChange("image", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">بارگذاری تصویر (اختیاری)</label>
            <input
              type="file"
              accept="image/*"
              className="w-full rounded border px-3 py-2 bg-background"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const dataUrl = String(reader.result || "");
                  handleChange("image", dataUrl as any);
                };
                reader.readAsDataURL(file);
              }}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">دسته (الزامی)</label>
            <select
              className="w-full rounded border px-3 py-2 bg-background"
              value={form.category || "هاست"}
              onChange={(e) => {
                const cat = e.target.value;
                const firstSub = (categoryToSubcategories[cat] ?? [""])[0] || "";
                setForm((prev) => ({ ...prev, category: cat, subcategory: firstSub }));
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">زیر دسته (الزامی)</label>
            <select
              className="w-full rounded border px-3 py-2 bg-background"
              value={form.subcategory || ""}
              onChange={(e) => handleChange("subcategory", e.target.value)}
            >
              {subcategories.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-sm mb-1">توضیحات</label>
            <textarea
              className="w-full rounded border px-3 py-2 min-h-20 bg-background"
              value={form.desc || ""}
              onChange={(e) => handleChange("desc", e.target.value)}
            />
          </div>
          {form.image && (
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm mb-1">پیش‌نمایش تصویر</label>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.image} alt="پیش‌نمایش" className="max-h-40 rounded border" />
            </div>
          )}
          <div>
            <label className="block text-sm mb-1">قیمت (الزامی) — بدون تومان</label>
            <input
              className="w-full rounded border px-3 py-2 bg-background"
              value={form.price || ""}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Storage (فضای دیسک)</label>
            <input
              className="w-full rounded border px-3 py-2 bg-background"
              value={form.storage || ""}
              onChange={(e) => handleChange("storage", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Bandwidth (پهنای باند)</label>
            <input
              className="w-full rounded border px-3 py-2 bg-background"
              value={form.bandwidth || ""}
              onChange={(e) => handleChange("bandwidth", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Uptime (آپتایم)</label>
            <input
              className="w-full rounded border px-3 py-2 bg-background"
              value={form.uptime || ""}
              onChange={(e) => handleChange("uptime", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Panel (کنترل پنل)</label>
            <input
              className="w-full rounded border px-3 py-2 bg-background"
              value={form.panel || ""}
              onChange={(e) => handleChange("panel", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">SSL (گواهی امنیتی)</label>
            <input
              className="w-full rounded border px-3 py-2 bg-background"
              value={form.ssl || ""}
              onChange={(e) => handleChange("ssl", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Backups (بکاپ)</label>
            <input
              className="w-full rounded border px-3 py-2 bg-background"
              value={form.backups || ""}
              onChange={(e) => handleChange("backups", e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button type="button" className="rounded border px-4 py-2 bg-background hover:bg-blue-600 hover:text-white" onClick={resetForm}>
            پاک کردن فرم
          </button>
          <button type="submit" className="rounded bg-blue-600 text-white px-5 py-2 hover:bg-blue-700">
            {editingProduct ? "ویرایش محصول" : "افزودن محصول"}
          </button>
        </div>
        </form>
      )}

      {/* جدول محصولات */}
      <div className="border rounded-xl [direction:ltr] bg-background">
        <div className="max-h-[60vh] overflow-y-auto pr-2 [scrollbar-gutter:stable]">
          <div className="[direction:rtl] overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-foreground/5 text-foreground/80">
                <tr>
                  <th className="p-3 text-right">شناسه</th>
                  <th className="p-3 text-right">عنوان</th>
                  <th className="p-3 text-right">دسته</th>
                  <th className="p-3 text-right">زیر دسته</th>
                  <th className="p-3 text-right">قیمت</th>
                  <th className="p-3 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="p-3">{row.id}</td>
                    <td className="p-3">{row.title}</td>
                    <td className="p-3">{row.category}</td>
                    <td className="p-3">{row.subcategory}</td>
                    <td className="p-3">{row.price} تومان</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(row);
                            setForm({
                              title: row.title,
                              desc: row.desc || "",
                              category: row.category,
                              subcategory: row.subcategory,
                              price: row.price,
                              storage: row.storage || "",
                              bandwidth: row.bandwidth || "",
                              uptime: row.uptime || "",
                              panel: row.panel || "",
                              ssl: row.ssl || "",
                              backups: row.backups || "",
                              image: row.image || "",
                            });
                          }}
                          className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("آیا از حذف این محصول اطمینان دارید؟")) {
                              setRows((prev) => prev.filter((p) => p.id !== row.id));
                            }
                          }}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td className="p-3 text-center text-foreground/70" colSpan={6}>
                      {rows.length === 0 ? "محصولی یافت نشد." : "نتیجه‌ای برای فیلترهای انتخابی یافت نشد."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}


