"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks: Array<{ href: string; label: string }> = [
  { href: "/admin", label: "داشبورد" },
  { href: "/admin/users", label: "مدیریت کاربران" },
  { href: "/admin/products", label: "مدیریت محصولات" },
  { href: "/admin/orders", label: "مدیریت سفارشات" },
  { href: "/admin/tickets", label: "تیکت‌ها" },
  { href: "/admin/contacts", label: "فرم‌های تماس" },
  { href: "/admin/projects", label: "پروژه‌ها" },
  { href: "/admin/finance", label: "مدیریت مالی" },
  { href: "/admin/coupons", label: "کدهای تخفیف" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  // مسیرهایی که باید فقط در UI مخفی شوند (بدون حذف)
  const hiddenPaths = new Set<string>(["/admin/finance"]);
  return (
    <aside className="w-full max-w-64 shrink-0 border rounded-lg p-4 h-max sticky top-20 bg-background">
      <h2 className="mb-3 text-sm font-bold">پنل ادمین</h2>
      <nav className="flex flex-col gap-2 text-sm">
        {adminLinks.filter(link => !hiddenPaths.has(link.href)).map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded px-3 py-2 transition-colors hover:bg-primary hover:text-white ${
                isActive ? "bg-primary/20 text-primary" : "bg-background text-foreground/80"
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


