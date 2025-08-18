"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Splash from "@/components/Splash";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [shouldShowContent, setShouldShowContent] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    // اگر مسیر غیر از روت است، مستقیم محتوا را نشان بده
    if (pathname !== "/") {
      setShouldShowContent(true);
      return;
    }
    // اگر قبلا اسپلش نمایش داده شده، مستقیم محتوا را نشان بده
    const alreadyShown = typeof window !== "undefined" && sessionStorage.getItem("splashShown");
    if (alreadyShown) setShouldShowContent(true);
  }, [pathname]);

  return (
    <>
      {!shouldShowContent && (
        <Splash onFinish={() => setShouldShowContent(true)} />
      )}
      {shouldShowContent && children}
    </>
  );
}


