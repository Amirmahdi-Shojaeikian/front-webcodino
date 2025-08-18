"use client";

import { useEffect, useState, useMemo } from "react";
import type { AdminUserRow } from "@/app/api/admin/users/route";

export default function AdminUsersPage() {
  const [userRows, setUserRows] = useState<AdminUserRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("همه");
  const [roleFilter, setRoleFilter] = useState<string>("همه");
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/users", { cache: "no-store" });
        const data = await res.json();
        if (alive) setUserRows(Array.isArray(data?.items) ? data.items : []);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AdminUserRow | null>(null);

  function startEdit(row: AdminUserRow) {
    setEditingId(row.id);
    setDraft({ ...row });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
  }

  function saveEdit() {
    if (!draft) return;
    setUserRows((prev) => prev.map((u) => (u.id === draft.id ? draft : u)));
    setEditingId(null);
    setDraft(null);
  }

  function deleteUser(id: string) {
    if (typeof window !== "undefined") {
      const ok = window.confirm("آیا از حذف کاربر مطمئن هستید؟");
      if (!ok) return;
    }
    setUserRows((prev) => prev.filter((u) => u.id !== id));
    if (editingId === id) cancelEdit();
  }

  function formatPersianDate(d: Date) {
    try {
      return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(d);
    } catch {
      return "";
    }
  }

  function addNewUser() {
    const id = `U-NEW-${Date.now()}`;
    const newRow: AdminUserRow = {
      id,
      name: "",
      email: "",
      role: "کاربر",
      status: "فعال",
      createdAt: formatPersianDate(new Date()),
    };
    setUserRows((prev) => [newRow, ...prev]);
    startEdit(newRow);
  }

  // فیلتر کردن داده‌ها
  const filteredUsers = useMemo(() => {
    return userRows.filter((user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "همه" || user.status === statusFilter;
      const matchesRole = roleFilter === "همه" || user.role === roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [userRows, searchTerm, statusFilter, roleFilter]);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
        <button
          className="rounded-xl bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
          onClick={addNewUser}
        >
          افزودن کاربر
        </button>
      </div>

      {/* فیلترها و جستجو */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm mb-1">جستجو</label>
                            <input
                    type="text"
                    placeholder="جستجو در نام، ایمیل یا شناسه..."
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
            <option value="غیرفعال">غیرفعال</option>
            <option value="مسدود">مسدود</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">نقش</label>
                            <select
                    className="w-full rounded-lg border px-3 py-2 bg-background [&>option]:bg-black [&>option]:text-white"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
            <option value="همه">همه</option>
            <option value="ادمین">ادمین</option>
            <option value="کاربر">کاربر</option>
            <option value="پشتیبان">پشتیبان</option>
          </select>
        </div>
        <div className="flex items-end">
                            <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("همه");
                      setRoleFilter("همه");
                    }}
                    className="w-full rounded-lg border px-3 py-2 bg-background hover:bg-blue-600 hover:text-white"
                  >
            پاک کردن فیلترها
          </button>
        </div>
      </div>
      <div className="border rounded-xl [direction:ltr] bg-background">
        <div className="max-h-[60vh] overflow-y-auto pr-2 [scrollbar-gutter:stable]">
          <div className="[direction:rtl] overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-foreground/5 text-foreground/80">
                <tr>
                  <th className="p-3 text-right">شناسه</th>
                  <th className="p-3 text-right">نام</th>
                  <th className="p-3 text-right">ایمیل</th>
                  <th className="p-3 text-right">نقش</th>
                  <th className="p-3 text-right">وضعیت</th>
                  <th className="p-3 text-right">تاریخ ایجاد</th>
                  <th className="p-3 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td className="p-3 text-center" colSpan={7}>در حال بارگذاری...</td></tr>
                )}
                {!isLoading && filteredUsers.map((row) => {
                  const isEditing = editingId === row.id;
                  return (
                  <tr key={row.id} className="border-t">
                    <td className="p-3 align-top">{row.id}</td>
                    <td className="p-3 align-top">
                      {isEditing ? (
                        <input
                          className="rounded border px-2 py-1 w-full min-w-28 bg-background"
                          value={draft?.name ?? ""}
                          onChange={(e) => setDraft((d) => (d ? { ...d, name: e.target.value } : d))}
                        />
                      ) : (
                        row.name
                      )}
                    </td>
                    <td className="p-3 align-top">
                      {isEditing ? (
                        <input
                          type="email"
                          className="rounded border px-2 py-1 w-full min-w-40 bg-background"
                          value={draft?.email ?? ""}
                          onChange={(e) => setDraft((d) => (d ? { ...d, email: e.target.value } : d))}
                        />
                      ) : (
                        row.email
                      )}
                    </td>
                    <td className="p-3 align-top">
                      {isEditing ? (
                        <select
                          className="rounded border px-2 py-1 w-full min-w-28 bg-background"
                          value={draft?.role ?? "کاربر"}
                          onChange={(e) =>
                            setDraft((d) => (d ? { ...d, role: e.target.value as AdminUserRow["role"] } : d))
                          }
                        >
                          <option value="ادمین">ادمین</option>
                          <option value="کاربر">کاربر</option>
                          <option value="پشتیبان">پشتیبان</option>
                        </select>
                      ) : (
                        row.role
                      )}
                    </td>
                    <td className="p-3 align-top">
                      {isEditing ? (
                        <select
                          className="rounded border px-2 py-1 w-full min-w-28 bg-background"
                          value={draft?.status ?? "فعال"}
                          onChange={(e) =>
                            setDraft((d) => (d ? { ...d, status: e.target.value as AdminUserRow["status"] } : d))
                          }
                        >
                          <option value="فعال">فعال</option>
                          <option value="غیرفعال">غیرفعال</option>
                          <option value="مسدود">مسدود</option>
                        </select>
                      ) : (
                        row.status
                      )}
                    </td>
                    <td className="p-3 align-top">{row.createdAt}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              className="rounded border px-3 py-1 hover:bg-blue-600 hover:text-white"
                              onClick={saveEdit}
                            >
                              ذخیره
                            </button>
                            <button
                              className="rounded border px-3 py-1 hover:bg-blue-600 hover:text-white"
                              onClick={cancelEdit}
                            >
                              انصراف
                            </button>
                            <button
                              className="rounded border px-3 py-1 hover:bg-red-50 text-red-600 border-red-200"
                              onClick={() => deleteUser(row.id)}
                            >
                              حذف
                            </button>
                          </>
                        ) : (
                          <button
                            className="rounded border px-3 py-1 hover:bg-blue-600 hover:text-white"
                            onClick={() => startEdit(row)}
                          >
                            ویرایش
                          </button>
                        )}
                        {!isEditing && (
                          <button
                            className="rounded border px-3 py-1 hover:bg-red-50 text-red-600 border-red-200"
                            onClick={() => deleteUser(row.id)}
                          >
                            حذف
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })}
                {!isLoading && filteredUsers.length === 0 && (
                  <tr><td className="p-3 text-center text-foreground/70" colSpan={7}>
                    {userRows.length === 0 ? "کاربری یافت نشد." : "نتیجه‌ای برای فیلترهای انتخابی یافت نشد."}
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


