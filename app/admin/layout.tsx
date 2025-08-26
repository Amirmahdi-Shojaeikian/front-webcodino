import type { ReactNode } from "react";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProtectedRoute>
      <div className="mx-auto max-w-7xl mt-6 sm:mt-8">{children}</div>
    </AdminProtectedRoute>
  );
}


