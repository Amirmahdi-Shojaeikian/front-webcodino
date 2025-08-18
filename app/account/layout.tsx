import type { ReactNode } from "react";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-7xl mt-6 sm:mt-8">{children}</div>;
}


