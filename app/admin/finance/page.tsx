"use client";

import { useEffect, useState, useMemo } from "react";

type FinanceTransaction = {
  id: string;
  date: string; // 1403/05/01
  userName: string;
  nationalId: string;
  kind: "واریز" | "برداشت";
  method: "آنلاین - ریالی" | "آنلاین - کیریپتو";
  amount: string; // "۱,۲۵۰,۰۰۰"
  status: "موفق" | "ناموفق" | "در انتظار";
  description?: string;
};

export default function AdminFinancePage() {
  const [rows, setRows] = useState<FinanceTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [kindFilter, setKindFilter] = useState<string>("همه");
  const [statusFilter, setStatusFilter] = useState<string>("همه");
  const [methodFilter, setMethodFilter] = useState<string>("همه");
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/finance", { cache: "no-store" });
        const data = await res.json();
        if (alive) setRows(Array.isArray(data?.items) ? data.items : []);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // فیلتر کردن تراکنش‌ها
  const filteredTransactions = useMemo(() => {
    return rows.filter((transaction) => {
      const matchesSearch = 
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.nationalId.includes(searchTerm) ||
        (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesKind = kindFilter === "همه" || transaction.kind === kindFilter;
      const matchesStatus = statusFilter === "همه" || transaction.status === statusFilter;
      const matchesMethod = methodFilter === "همه" || transaction.method === methodFilter;
      
      return matchesSearch && matchesKind && matchesStatus && matchesMethod;
    });
  }, [rows, searchTerm, kindFilter, statusFilter, methodFilter]);
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">مدیریت مالی</h1>

      {/* فیلترها و جستجو */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm mb-1">جستجو</label>
          <input
            type="text"
            placeholder="جستجو در شناسه، نام کاربر، کد ملی یا توضیحات..."
            className="w-full rounded-lg border px-3 py-2 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">نوع تراکنش</label>
          <select
            className="w-full rounded-lg border px-3 py-2 bg-background [&>option]:bg-black [&>option]:text-white"
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value)}
          >
            <option value="همه">همه</option>
            <option value="واریز">واریز</option>
            <option value="برداشت">برداشت</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">وضعیت</label>
          <select
            className="w-full rounded-lg border px-3 py-2 bg-background [&>option]:bg-black [&>option]:text-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="همه">همه</option>
            <option value="موفق">موفق</option>
            <option value="ناموفق">ناموفق</option>
            <option value="در انتظار">در انتظار</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              setSearchTerm("");
              setKindFilter("همه");
              setStatusFilter("همه");
              setMethodFilter("همه");
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
                  <th className="p-3 text-right">شناسه تراکنش</th>
                  <th className="p-3 text-right">تاریخ</th>
                  <th className="p-3 text-right">نام کاربر</th>
                  <th className="p-3 text-right">کد ملی</th>
                  <th className="p-3 text-right">نوع تراکنش</th>
                  <th className="p-3 text-right">روش پرداخت</th>
                  <th className="p-3 text-right">مبلغ</th>
                  <th className="p-3 text-right">وضعیت</th>
                  <th className="p-3 text-right">توضیحات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td className="p-3 text-center" colSpan={9}>در حال بارگذاری...</td></tr>
                )}
                {!isLoading && filteredTransactions.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="p-3">{t.id}</td>
                    <td className="p-3">{t.date}</td>
                    <td className="p-3">{t.userName}</td>
                    <td className="p-3">{t.nationalId}</td>
                    <td className="p-3">{t.kind}</td>
                    <td className="p-3">{t.method}</td>
                    <td className="p-3">{t.amount} تومان</td>
                    <td className="p-3">{t.status}</td>
                    <td className="p-3 max-w-[300px] line-clamp-2">{t.description}</td>
                  </tr>
                ))}
                {!isLoading && filteredTransactions.length === 0 && (
                  <tr><td className="p-3 text-center text-foreground/70" colSpan={9}>
                    {rows.length === 0 ? "تراکنشی یافت نشد." : "نتیجه‌ای برای فیلترهای انتخابی یافت نشد."}
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


