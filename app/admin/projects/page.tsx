"use client";

import { useEffect, useMemo, useState } from "react";

type Project = {
  id: number;
  title: string;
  desc: string;
  category: string;
  subcategory: string;
  link?: string;
};

const categoryToSubcategories: Record<string, string[]> = {
  "سایت": ["فروشگاهی", "شرکتی", "پزشکی", "وبلاگ", "اختصاصی", "رزومه‌ای"],
  "اپلیکیشن": ["فروشگاهی", "پزشکی", "اختصاصی"],
  "ربات": ["تلگرام", "اینستاگرام", "بله"],
  "تولید محتوا": ["فتوشاپ", "تولید ویدیو", "محتوا نویسی"],
};

const seedProjects: Project[] = [];

export default function AdminProjectsPage() {
  const categories = useMemo(() => Object.keys(categoryToSubcategories), []);
  const [rows, setRows] = useState<Project[]>(seedProjects);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("همه");
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>("همه");
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/projects", { cache: "no-store" });
        const data = await res.json();
        if (alive) setRows(Array.isArray(data?.items) ? data.items : []);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Project | null>(null);

  function startEdit(row: Project) {
    setEditingId(row.id);
    setDraft({ ...row });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
  }

  function saveEdit() {
    if (!draft) return;
    setRows((prev) => prev.map((r) => (r.id === draft.id ? draft : r)));
    setEditingId(null);
    setDraft(null);
  }

  function deleteProject(id: number) {
    if (typeof window !== "undefined") {
      const ok = window.confirm("آیا از حذف پروژه مطمئن هستید؟");
      if (!ok) return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) cancelEdit();
  }

  function addNew() {
    const nextId = (rows.length ? Math.max(...rows.map((p) => p.id)) : 0) + 1;
    const cat = categories[0];
    const sub = categoryToSubcategories[cat]?.[0] ?? "";
    const newRow: Project = {
      id: nextId,
      title: "",
      desc: "",
      category: cat,
      subcategory: sub,
      link: "",
    };
    setRows((prev) => [newRow, ...prev]);
    startEdit(newRow);
  }

  // فیلتر کردن پروژه‌ها
  const filteredProjects = useMemo(() => {
    return rows.filter((project) => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.id.toString().includes(searchTerm) ||
        (project.link && project.link.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === "همه" || project.category === categoryFilter;
      const matchesSubcategory = subcategoryFilter === "همه" || project.subcategory === subcategoryFilter;
      
      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [rows, searchTerm, categoryFilter, subcategoryFilter]);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">مدیریت پروژه‌ها</h1>
        <button className="rounded-xl bg-primary text-white px-4 py-2 text-sm hover:bg-primary-light" onClick={addNew}>
          افزودن پروژه
        </button>
      </div>

      {/* فیلترها و جستجو */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm mb-1">جستجو</label>
          <input
            type="text"
            placeholder="جستجو در عنوان، توضیحات، شناسه یا لینک..."
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
        <div className="flex items-end">
          <button
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("همه");
              setSubcategoryFilter("همه");
            }}
            className="w-full rounded-lg border px-3 py-2 bg-background hover:bg-primary hover:text-white"
          >
            پاک کردن فیلترها
          </button>
        </div>
      </div>

      <div className="border rounded-xl [direction:ltr] bg-background">
        <div className="max-h-[60vh] overflow-y-auto pr-2 [scrollbar-gutter:stable]">
          <div className="[direction:rtl] overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-primary/10 text-foreground/80">
                <tr>
                  <th className="p-3 text-right">شناسه</th>
                  <th className="p-3 text-right">عنوان</th>
                  <th className="p-3 text-right">دسته</th>
                  <th className="p-3 text-right">زیر دسته</th>
                  <th className="p-3 text-right">لینک نمونه کار</th>
                  <th className="p-3 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td className="p-3 text-center" colSpan={6}>در حال بارگذاری...</td></tr>
                )}
                {!isLoading && filteredProjects.map((row) => {
                  const isEditing = editingId === row.id;
                  const subs = categoryToSubcategories[isEditing ? (draft?.category ?? row.category) : row.category] ?? [];
                  return (
                    <tr key={row.id} className="border-t align-top">
                      <td className="p-3">{row.id}</td>
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            className="rounded border px-2 py-1 w-full min-w-40"
                            value={draft?.title ?? ""}
                            onChange={(e) => setDraft((d) => (d ? { ...d, title: e.target.value } : d))}
                          />
                        ) : (
                          row.title
                        )}
                      </td>
                      <td className="p-3">
                        {isEditing ? (
                          <select
                            className="rounded border px-2 py-1 bg-background"
                            value={draft?.category ?? ""}
                            onChange={(e) =>
                              setDraft((d) => {
                                if (!d) return d;
                                const cat = e.target.value;
                                const firstSub = categoryToSubcategories[cat]?.[0] ?? "";
                                return { ...d, category: cat, subcategory: firstSub };
                              })
                            }
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        ) : (
                          row.category
                        )}
                      </td>
                      <td className="p-3">
                        {isEditing ? (
                          <select
                            className="rounded border px-2 py-1 bg-background"
                            value={draft?.subcategory ?? ""}
                            onChange={(e) => setDraft((d) => (d ? { ...d, subcategory: e.target.value } : d))}
                          >
                            {subs.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        ) : (
                          row.subcategory
                        )}
                      </td>
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            className="rounded border px-2 py-1 w-full min-w-40 ltr:text-left"
                            placeholder="https://... یا /path"
                            value={draft?.link ?? ""}
                            onChange={(e) => setDraft((d) => (d ? { ...d, link: e.target.value } : d))}
                          />
                        ) : row.link ? (
                          <a href={row.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ltr:text-left">
                            {row.link}
                          </a>
                        ) : (
                          <span className="text-foreground/50">—</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <button className="rounded border px-3 py-1 bg-background hover:bg-blue-600 hover:text-white" onClick={saveEdit}>
                                ذخیره
                              </button>
                              <button className="rounded border px-3 py-1 bg-background hover:bg-blue-600 hover:text-white" onClick={cancelEdit}>
                                انصراف
                              </button>
                              <button
                                className="rounded border px-3 py-1 hover:bg-red-50 text-red-600 border-red-200"
                                onClick={() => deleteProject(row.id)}
                              >
                                حذف
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="rounded border px-3 py-1 bg-background hover:bg-blue-600 hover:text-white"
                                onClick={() => startEdit(row)}
                              >
                                ویرایش
                              </button>
                              <button
                                className="rounded border px-3 py-1 hover:bg-red-50 text-red-600 border-red-200"
                                onClick={() => deleteProject(row.id)}
                              >
                                حذف
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!isLoading && filteredProjects.length === 0 && (
                  <tr><td className="p-3 text-center text-foreground/70" colSpan={6}>
                    {rows.length === 0 ? "پروژه‌ای یافت نشد." : "نتیجه‌ای برای فیلترهای انتخابی یافت نشد."}
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


