"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const buttons: Array<{ href: string; label: string; icon: string; hidden?: boolean }> = [
  { href: "/admin/users", label: "مدیریت کاربران", icon: "👥" },
  { href: "/admin/products", label: "مدیریت محصولات", icon: "📦", hidden: true },
  { href: "/admin/orders", label: "مدیریت سفارشات", icon: "🛒", hidden: true },
  { href: "/admin/tickets", label: "تیکت‌ها", icon: "📧" },
  { href: "/admin/contacts", label: "فرم‌های تماس", icon: "📝" },
  { href: "/admin/projects", label: "پروژه‌ها", icon: "🚀", hidden: true },
  { href: "/admin/finance", label: "مدیریت مالی", icon: "💰", hidden: true },
  { href: "/admin/coupons", label: "کدهای تخفیف", icon: "🎁", hidden: true },
];

type DashboardStats = {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalTickets: number;
  totalContacts: number;
  totalProjects: number;
  totalCoupons: number;
  recentOrders: Array<{ id: string; amount: string; status: string; date: string }>;
  recentTickets: Array<{ id: string; subject: string; status: string; date: string }>;
  recentContacts: Array<{ id: string; name: string; subject: string; status: string; date: string }>;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalTickets: 0,
    totalContacts: 0,
    totalProjects: 0,
    totalCoupons: 0,
    recentOrders: [],
    recentTickets: [],
    recentContacts: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // شبیه‌سازی دریافت آمار از API
    setTimeout(() => {
      setStats({
        totalUsers: 1250,
        totalProducts: 45,
        totalOrders: 89,
        totalTickets: 23,
        totalContacts: 15,
        totalProjects: 67,
        totalCoupons: 12,
        recentOrders: [
          { id: "ORD-001", amount: "2,500,000 تومان", status: "تکمیل شده", date: "1403/05/20" },
          { id: "ORD-002", amount: "1,800,000 تومان", status: "در انتظار", date: "1403/05/19" },
          { id: "ORD-003", amount: "3,200,000 تومان", status: "فعال", date: "1403/05/18" },
        ],
        recentTickets: [
          { id: "TKT-001", subject: "مشکل در ورود به حساب", status: "باز", date: "1403/05/20" },
          { id: "TKT-002", subject: "سوال درباره محصولات", status: "پاسخ داده شده", date: "1403/05/19" },
          { id: "TKT-003", subject: "درخواست تمدید سرویس", status: "باز", date: "1403/05/18" },
        ],
        recentContacts: [
          { id: "CT-001", name: "علی رضایی", subject: "مشاوره", status: "جدید", date: "1403/05/20" },
          { id: "CT-002", name: "فاطمه احمدی", subject: "پشتیبانی", status: "خوانده شده", date: "1403/05/19" },
          { id: "CT-003", name: "محمد کریمی", subject: "پیشنهاد همکاری", status: "پاسخ داده شده", date: "1403/05/18" },
        ],
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">پنل مدیریت</h1>

      {/* آمار کلی */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-background border rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{isLoading ? "..." : stats.totalUsers}</div>
          <div className="text-sm text-foreground/70">کل کاربران</div>
        </div>
        <div className="bg-background border rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{isLoading ? "..." : stats.totalTickets}</div>
          <div className="text-sm text-foreground/70">کل تیکت‌ها</div>
        </div>
        <div className="bg-background border rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{isLoading ? "..." : stats.totalContacts}</div>
          <div className="text-sm text-foreground/70">فرم‌های تماس</div>
        </div>
        {false && (
          <div className="bg-background border rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{isLoading ? "..." : "مدیریت مالی"}</div>
            <div className="text-sm text-foreground/70">وضعیت مالی</div>
          </div>
        )}
      </div>

      {/* منوی دسترسی سریع */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {buttons.filter(b => !b.hidden).map((b) => (
          <Link
            key={b.href}
            href={b.href}
            className="rounded-2xl border p-6 text-center text-lg bg-background hover:bg-blue-600 hover:text-white transition-colors"
          >
            <div className="text-3xl mb-2">{b.icon}</div>
            <div>{b.label}</div>
          </Link>
        ))}
      </div>

      {/* آخرین تیکت‌ها و فرم‌های تماس */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-2xl p-5 bg-background">
          <h2 className="text-lg font-bold mb-4">آخرین تیکت‌ها</h2>
          {isLoading ? (
            <div className="text-center text-foreground/70">در حال بارگذاری...</div>
          ) : (
            <div className="space-y-3">
              {stats.recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 bg-black rounded-lg">
                  <div>
                    <div className="font-medium text-white">{ticket.id}</div>
                    <div className="text-sm text-white">{ticket.subject}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">{ticket.status}</div>
                    <div className="text-xs text-white">{ticket.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border rounded-2xl p-5 bg-background">
          <h2 className="text-lg font-bold mb-4">آخرین فرم‌های تماس</h2>
          {isLoading ? (
            <div className="text-center text-foreground/70">در حال بارگذاری...</div>
          ) : (
            <div className="space-y-3">
              {stats.recentContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 bg-purple-900 rounded-lg">
                  <div>
                    <div className="font-medium text-white">{contact.name}</div>
                    <div className="text-sm text-white">{contact.subject}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">{contact.status}</div>
                    <div className="text-xs text-white">{contact.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


