"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AdminProtectedRoute({ children, fallback }: AdminProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // کاربر لاگین نکرده، به صفحه لاگین بفرست
        router.push("/login");
      } else if (user && user.role !== "admin") {
        // کاربر لاگین کرده ولی ادمین نیست، به صفحه کاربری بفرست
        router.push("/account");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال انتقال به صفحه ورود...</p>
        </div>
      </div>
    );
  }

  if (user && user.role !== "admin") {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">دسترسی محدود</h1>
          <p className="text-gray-600 mb-4">شما مجاز به دسترسی به این صفحه نیستید.</p>
          <button 
            onClick={() => router.push("/account")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            بازگشت به پنل کاربری
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
