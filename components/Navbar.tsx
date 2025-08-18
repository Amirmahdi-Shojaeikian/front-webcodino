"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import UserMenu from "./UserMenu";
import { useAuth } from "@/contexts/AuthContext";

const links: Array<{ href: string; label: string }> = [
  { href: "/", label: "خانه" },
  { href: "/products", label: "محصولات" },
  { href: "/projects", label: "پروژه‌ها" },
  { href: "https://blog.webcodino.ir/", label: "وبلاگ" },
  { href: "/faq", label: "سوالات متداول" },
  { href: "/about", label: "درباره ما" },
  { href: "/contact", label: "تماس با ما" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true } as AddEventListenerOptions);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // بستن منوی همبرگری وقتی صفحه تغییر می‌کند
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className={`sticky top-4 z-50 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20 rounded-2xl border transition-colors backdrop-blur-md ${
      mounted && isScrolled ? "bg-background/80" : "bg-background/20"
    }`}>
      {/* کنترل باز/بسته منوی موبایل */}
      <input 
        id="nav-toggle" 
        type="checkbox" 
        className="peer hidden" 
        checked={isMenuOpen}
        onChange={(e) => setIsMenuOpen(e.target.checked)}
      />

      <div className="mx-auto relative flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* دسکتاپ: لوگو سمت راست */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/" aria-label="خانه" className="flex items-center">
            <Image src="/logo3.png" alt="لوگو وب‌کدینو" width={240} height={64} priority className="h-16 w-auto" />
          </Link>
        </div>
        
        {/* موبایل: دکمه همبرگری سمت راست */}
        <label htmlFor="nav-toggle" className="md:hidden p-2 rounded hover:bg-primary hover:text-white cursor-pointer">
          {/* آیکون همبرگری - وقتی منو بسته است */}
          <svg className={isMenuOpen ? "hidden" : "block"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          {/* آیکون ضربدر - وقتی منو باز است */}
          <svg className={isMenuOpen ? "block" : "hidden"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </label>
        
        {/* دسکتاپ: منوی وسط */}
        <nav className="hidden md:flex gap-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const isExternal = link.href.startsWith("http");
            return (
              <Link
                key={link.href}
                href={link.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={`text-base transition-colors hover:text-primary ${
                  isActive ? "text-primary font-semibold" : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        
        {/* موبایل: لوگو وسط */}
        <div className="md:hidden flex items-center gap-3">
          <Link href="/" aria-label="خانه" className="flex items-center mx-auto">
            <Image src="/logo3.png" alt="لوگو وب‌کدینو" width={200} height={56} priority className="h-14 w-auto" />
          </Link>
        </div>
        
        {/* منوی کاربری سمت چپ */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          ) : isAuthenticated ? (
            <UserMenu userName={user?.name || "کاربر"} balance={150000} />
          ) : (
            <Link 
              href="/auth" 
              className="p-2 rounded hover:bg-primary hover:text-white transition-colors"
              aria-label="ورود / ثبت‌نام"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="7.5" r="3.5" />
                <path d="M4 20c0-3.8 4-6.5 8-6.5s8 2.7 8 6.5" />
              </svg>
            </Link>
          )}
        </div>
      </div>
      {/* منوی کشویی موبایل */}
      <div className={`md:hidden px-4 pb-3 ${isMenuOpen ? "block" : "hidden"}`}>
        <nav className="flex flex-col gap-2 border-t pt-3">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const isExternal = link.href.startsWith("http");
            return (
              <Link
                key={link.href}
                href={link.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={`rounded px-3 py-2 transition-colors hover:bg-blue-600 hover:text-white ${
                  isActive ? "bg-blue-100 text-blue-700" : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}


