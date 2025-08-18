"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const accountLinks: Array<{ href: string; label: string }> = [
  { href: "/account/subscriptions", label: "اشتراک‌های من" },
  { href: "/account/cart", label: "سبد خرید" },
  { href: "/account/orders", label: "سفارشات" },
  { href: "/account/tickets", label: "تیکت‌های پشتیبانی" },
  { href: "/account/auth", label: "احراز هویت" },
  { href: "/account/coupons", label: "کدهای تخفیف" },
  { href: "/account/change-password", label: "تغییر رمز" },
  { href: "/account/logout", label: "خروج" },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  // مسیرهایی که باید مخفی شوند (بدون حذف کدها)
  const hiddenPaths = new Set<string>([
    "/account/cart",
    "/account/orders",
    "/account/coupons",
    "/account/subscriptions",
  ]);
  return (
    <aside className="w-full border rounded-lg p-4 h-max sticky top-20">
      <h2 className="mb-3 text-sm font-bold">حساب کاربری</h2>
      <nav className="flex flex-wrap items-center gap-2 text-sm">
        {accountLinks.filter(link => !hiddenPaths.has(link.href)).map((link) => {
          const isActive = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded px-3 py-2 transition-colors hover:bg-primary hover:text-white ${
                isActive ? "bg-primary/20 text-primary" : "text-foreground/80"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}


