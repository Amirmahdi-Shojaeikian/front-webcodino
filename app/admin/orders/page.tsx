"use client";

import { useEffect, useState, useMemo } from "react";
import type { OrderRow } from "@/app/account/orders/data";

type OrderStatus = OrderRow["status"];
type AdminOrderRow = OrderRow & { userName: string; userNationalId: string };

export default function AdminOrdersPage() {
  const [rows, setRows] = useState<AdminOrderRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("همه");
  const [dateFilter, setDateFilter] = useState<string>("همه");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRow | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/orders", { cache: "no-store" });
        const data = await res.json();
        if (alive) setRows(Array.isArray(data?.items) ? data.items : []);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftStatus, setDraftStatus] = useState<OrderStatus>("پرداخت شده");

  function startEdit(row: OrderRow) {
    setEditingId(row.id);
    setDraftStatus(row.status);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function saveEdit() {
    setRows((prev) => prev.map((r) => (r.id === editingId ? { ...r, status: draftStatus } : r)));
    setEditingId(null);
  }

  function showOrderDetails(order: AdminOrderRow) {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  }

  function closeDetailsModal() {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  }

  // فیلتر کردن سفارشات
  const filteredOrders = useMemo(() => {
    return rows.filter((order) => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userNationalId.includes(searchTerm) ||
        order.items.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "همه" || order.status === statusFilter;
      
      // فیلتر تاریخ بهبود یافته
      let matchesDate = true;
      if (dateFilter !== "همه") {
        const orderDateParts = order.date.split('/');
        const filterDateParts = dateFilter.split('/');
        
        if (filterDateParts.length === 2) {
          // فیلتر بر اساس سال و ماه (مثل 1403/05)
          matchesDate = orderDateParts.length >= 2 && 
                       orderDateParts[0] === filterDateParts[0] && 
                       orderDateParts[1] === filterDateParts[1];
        } else if (filterDateParts.length === 1) {
          // فیلتر بر اساس سال (مثل 1403)
          matchesDate = orderDateParts.length >= 1 && orderDateParts[0] === filterDateParts[0];
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [rows, searchTerm, statusFilter, dateFilter]);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">مدیریت سفارشات</h1>

      {/* فیلترها و جستجو */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm mb-1">جستجو</label>
          <input
            type="text"
            placeholder="جستجو در کد سفارش، نام کاربر، کد ملی یا اقلام..."
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
            <option value="پرداخت شده">پرداخت شده</option>
            <option value="در حال پردازش">در حال پردازش</option>
            <option value="مرجوع">مرجوع</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">تاریخ</label>
          <select
            className="w-full rounded-lg border px-3 py-2 bg-background [&>option]:bg-black [&>option]:text-white"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="همه">همه</option>
            <option value="1403/05">خرداد 1403</option>
            <option value="1403/04">اردیبهشت 1403</option>
            <option value="1403/03">فروردین 1403</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("همه");
              setDateFilter("همه");
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
                  <th className="p-3 text-right">کد سفارش</th>
                  <th className="p-3 text-right">تاریخ</th>
                  <th className="p-3 text-right">اقلام</th>
                  <th className="p-3 text-right">نام کاربر</th>
                  <th className="p-3 text-right">کد ملی</th>
                  <th className="p-3 text-right">مبلغ</th>
                  <th className="p-3 text-right">وضعیت</th>
                  <th className="p-3 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td className="p-3 text-center" colSpan={8}>در حال بارگذاری...</td></tr>
                )}
                {!isLoading && filteredOrders.map((row) => {
                  const isEditing = editingId === row.id;
                  return (
                    <tr key={row.id} className="border-t">
                      <td className="p-3">{row.id}</td>
                      <td className="p-3">{row.date}</td>
                      <td className="p-3">{row.items}</td>
                      <td className="p-3">{row.userName}</td>
                      <td className="p-3">{row.userNationalId}</td>
                      <td className="p-3">{row.amount}</td>
                      <td className="p-3">
                        {isEditing ? (
                          <select
                            className="rounded border px-2 py-1 bg-background"
                            value={draftStatus}
                            onChange={(e) => setDraftStatus(e.target.value as OrderStatus)}
                          >
                            <option value="پرداخت شده">پرداخت شده</option>
                            <option value="در حال پردازش">در حال پردازش</option>
                            <option value="مرجوع">مرجوع</option>
                          </select>
                        ) : (
                          row.status
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <button className="rounded border px-3 py-1 hover:bg-blue-600 hover:text-white" onClick={saveEdit}>
                                ذخیره
                              </button>
                              <button className="rounded border px-3 py-1 hover:bg-blue-600 hover:text-white" onClick={cancelEdit}>
                                انصراف
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="rounded border px-3 py-1 bg-background hover:bg-primary hover:text-white"
                                onClick={() => startEdit(row)}
                              >
                                ویرایش
                              </button>
                              <button
                                className="rounded border px-3 py-1 bg-background hover:bg-green-600 hover:text-white"
                                onClick={() => showOrderDetails(row)}
                              >
                                جزئیات
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!isLoading && filteredOrders.length === 0 && (
                  <tr><td className="p-3 text-center text-foreground/70" colSpan={8}>
                    {rows.length === 0 ? "سفارشی یافت نشد." : "نتیجه‌ای برای فیلترهای انتخابی یافت نشد."}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal جزئیات سفارش */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">جزئیات سفارش</h2>
              <button
                onClick={closeDetailsModal}
                className="text-foreground/60 hover:text-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">کد سفارش</label>
                  <p className="text-lg font-semibold">{selectedOrder.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">تاریخ سفارش</label>
                  <p className="text-lg">{selectedOrder.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">وضعیت</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedOrder.status === "پرداخت شده" ? "bg-green-100 text-green-800" :
                    selectedOrder.status === "در حال پردازش" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">مبلغ کل</label>
                  <p className="text-lg font-semibold text-green-600">{selectedOrder.amount}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">اطلاعات کاربر</label>
                <div className="bg-foreground/5 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-sm text-foreground/60">نام:</span>
                      <p className="font-medium">{selectedOrder.userName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-foreground/60">کد ملی:</span>
                      <p className="font-medium">{selectedOrder.userNationalId}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">اقلام سفارش</label>
                <div className="bg-foreground/5 rounded-lg p-4">
                  <p className="whitespace-pre-wrap">{selectedOrder.items}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2 border rounded-lg hover:bg-foreground/5"
                >
                  بستن
                </button>
                <button
                  onClick={() => {
                    closeDetailsModal();
                    startEdit(selectedOrder);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  ویرایش وضعیت
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


