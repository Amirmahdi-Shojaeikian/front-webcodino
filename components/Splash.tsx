"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type SplashProps = {
  onFinish?: () => void;
};

export default function Splash({ onFinish }: SplashProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    if (pathname !== "/") {
      setIsVisible(false);
      return;
    }

    const alreadyShown = typeof window !== "undefined" && sessionStorage.getItem("splashShown");
    if (alreadyShown) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    const TOTAL_MS = 2000;
    const FADE_MS = 400;
    const fadeTimer = setTimeout(() => setIsFadingOut(true), Math.max(0, TOTAL_MS - FADE_MS));
    const endTimer = setTimeout(() => {
      setIsVisible(false);
      setIsFadingOut(false);
      try {
        sessionStorage.setItem("splashShown", "1");
      } catch {}
      onFinish?.();
    }, TOTAL_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [pathname, onFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-400 ease-out ${
        isFadingOut ? "opacity-0" : "opacity-100"
      } p-6 sm:p-8`}
      aria-hidden={!isVisible}
    >
      <Image
        src="/logo.png"
        alt="لوگو"
        width={1120}
        height={320}
        priority
        className="w-[70vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[36vw] max-w-[1100px] h-auto max-h-[70vh]"
      />
    </div>
  );
}


