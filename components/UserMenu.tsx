"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useAuth } from "@/contexts/AuthContext";
import { logoutUser } from "@/lib/auth";

interface UserMenuProps {
  userName?: string;
}

export default function UserMenu({ userName = "کاربر" }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => setIsClient(true), []);

  // بستن منو با کلید Escape و قفل اسکرول
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  const modalContent = (
    <>
      {/* Overlay تیره‌تر */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000]" onClick={() => setIsOpen(false)} />

      {/* Modal */}
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-background/95 backdrop-blur-md rounded-2xl shadow-2xl border border-foreground/10 animate-in fade-in-0 zoom-in-95 duration-200">
          {/* هدر با عنوان وسط و دکمه بستن چپ */}
          <div className="relative border-b border-foreground/10">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-foreground/10"
              aria-label="بستن"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h3 className="text-center text-lg font-bold text-foreground py-4">منوی کاربری</h3>
          </div>

          {/* اطلاعات کاربر */}
          <div className="px-6 py-4 border-b border-foreground/10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-base font-semibold text-foreground truncate">{userName}</p>
                {/* موجودی مخفی شده */}
                {/* <p className="text-sm text-accent mt-1">موجودی: {balance.toLocaleString()} تومان</p> */}
              </div>
              <div className="w-12 h-12 bg-foreground/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/70">
                  <circle cx="12" cy="7.5" r="3.5" />
                  <path d="M4 20c0-3.8 4-6.5 8-6.5s8 2.7 8 6.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* گزینه‌های منو */}
          <div className="py-2">
            <Link href="/account" onClick={() => setIsOpen(false)} className="flex items-center px-6 py-4 text-base text-foreground/80 hover:bg-foreground/5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-4 text-foreground/60">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
              پیشخوان
            </Link>

            {/* گزینه کیف پول مخفی شده */}
            {/* <Link href="/account/wallet" onClick={() => setIsOpen(false)} className="flex items-center px-6 py-4 text-base text-foreground/80 hover:bg-foreground/5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-4 text-foreground/60">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
              کیف پول
            </Link> */}

            <div className="border-t border-foreground/10 my-2"></div>

            <button 
              onClick={handleLogout} 
              disabled={isLoggingOut}
              className="flex items-center w-full px-6 py-4 text-base text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              {isLoggingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400 ml-4"></div>
                  در حال خروج...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-4 text-red-400">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16,17 21,12 16,7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  خروج
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded hover:bg-primary hover:text-white transition-colors" aria-label="منوی کاربری">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="7.5" r="3.5" />
          <path d="M4 20c0-3.8 4-6.5 8-6.5s8 2.7 8 6.5" />
        </svg>
      </button>

      {isOpen && isClient && createPortal(modalContent, document.body)}
    </div>
  );
}
