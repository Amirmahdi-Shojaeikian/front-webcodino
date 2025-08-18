"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const actionCards: Array<{ href: string; label: string; icon: string; color?: string; showForRoles?: string[] }> = [
  { href: "/account/orders", label: "سفارشهای من", icon: "📦", showForRoles: ["admin"] },
  { href: "/account/cart", label: "سبد خرید", icon: "🛒", showForRoles: ["admin"] },
  { href: "/account/subscriptions", label: "اشتراک های من", icon: "📄", showForRoles: ["admin"] },
  { href: "/account/tickets", label: "تیکت پشتیبانی", icon: "📧" },
  { href: "/account/coupons", label: "کدهای تخفیف", icon: "🎁", showForRoles: ["admin"] },
  { href: "/account/change-password", label: "تغییر رمز", icon: "🔑" },
  { href: "/account/auth", label: "احراز هویت", icon: "🔒" },
  { href: "/account/logout", label: "خروج", icon: "🚪", color: "border-red-500" },
];

const statsCards: Array<{ label: string; count: number; showForRoles?: string[] }> = [
  { label: "کدهای تخفیف", count: 0, showForRoles: ["admin"] },
  { label: "تیکت های باز", count: 0, showForRoles: ["admin"] },
  { label: "محصولات سبد خرید", count: 0, showForRoles: ["admin"] },
  { label: "سفارشات فعال", count: 0, showForRoles: ["admin"] },
];

export default function AccountIndexPage() {
  const { user } = useAuth();
  
  // مسیرهایی که باید مخفی شوند
  const hiddenHrefs = new Set<string>(["/account/cart", "/account/orders", "/account/coupons", "/account/subscriptions", "/account/auth"]);

  // فیلتر کردن کارت‌های عملیات بر اساس نقش کاربر + مخفی‌سازی آیتم‌ها
  const filteredActionCards = actionCards
    .filter(card => !hiddenHrefs.has(card.href))
    .filter(card => {
      if (!card.showForRoles) return true;
      return card.showForRoles.includes(user?.role || 'user');
    });
  
  // فیلتر کردن کارت‌های آمار بر اساس نقش کاربر + مخفی‌سازی آیتم‌ها
  const filteredStatsCards = statsCards
    .filter(card => !["کدهای تخفیف", "محصولات سبد خرید", "سفارشات فعال", "تیکت های باز"].includes(card.label))
    .filter(card => {
      if (!card.showForRoles) return true;
      return card.showForRoles.includes(user?.role || 'user');
    });
  return (
    <section className="mt-6 sm:mt-8 space-y-6">
      {/* Welcome Section */}
      <div className="bg-background border rounded-2xl p-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="7.5" r="3.5" />
            <path d="M4 20c0-3.8 4-6.5 8-6.5s8 2.7 8 6.5" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold">خوش آمدید، {user?.name || 'کاربر'}</h2>
          <p className="text-foreground/70">{user?.email || 'ایمیل در دسترس نیست'}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {filteredStatsCards.map((stat) => (
          <div key={stat.label} className="bg-background border rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stat.count}</div>
            <div className="text-sm text-foreground/70">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {filteredActionCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`bg-background border rounded-2xl p-4 text-center hover:bg-primary hover:text-white transition-colors ${card.color || ''}`}
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="text-sm font-medium">{card.label}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}


