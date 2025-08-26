import type { ReactNode } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl mt-6 sm:mt-8">{children}</div>
    </ProtectedRoute>
  );
}


