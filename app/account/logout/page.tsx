"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { logoutUser } from "@/lib/auth";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // فراخوانی API logout
      await logoutUser();
      // پاک کردن state محلی
      logout();
      // انتقال به صفحه اصلی
      router.replace("/");
    } catch (error) {
      console.error("خطا در خروج:", error);
      // حتی در صورت خطا، logout محلی انجام شود
      logout();
      router.replace("/");
    }
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">خروج از حساب</h1>
      <div className="border rounded-xl p-5">
        <p className="text-sm text-foreground/70 mb-3">
          آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
        </p>
        <div className="flex gap-3">
          <button
            className="rounded-xl bg-blue-600 text-white px-5 py-2 text-base hover:bg-blue-700"
            onClick={handleLogout}
          >
            بله، خارج شو
          </button>
          <button
            className="rounded border px-5 py-2 text-base hover:bg-blue-600 hover:text-white"
            onClick={() => router.replace("/account")}
          >
            خیر، بازگشت
          </button>
        </div>
      </div>
    </section>
  );
}


