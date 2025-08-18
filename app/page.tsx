import Link from "next/link";
import NoScroll from "@/components/NoScroll";
import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "وب کدینو | طراحی سایت، اپلیکیشن و هاست",
  description: "شرکت وب کدینو ارائه‌دهنده خدمات طراحی سایت، اپلیکیشن، سرور، هاست و تولید محتوا. کیفیت و امنیت را با ما تجربه کنید.",
  keywords: "طراحی سایت, اپلیکیشن, هاست, سرور, وب کدینو",
};

export default function Home() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center text-center">
      <NoScroll />
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold">به وب‌کدینو خوش آمدید</h1>
        <p className="text-base sm:text-lg text-foreground/80">
          با وب‌کدینو کسب‌وکار خود را به دنیای دیجیتال بسپارید و با اطمینان رشد و موفقیت را تجربه کنید.
        </p>
        <p className="text-base sm:text-lg text-foreground/80">
          ما همراه مطمئن شما در مسیر توسعه آنلاین و تحقق رویای دیجیتال هستیم.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/products"
            className="rounded-lg bg-primary text-white px-5 py-2 text-base sm:text-lg transition-colors hover:bg-primary-light"
          >
            دیدن محصولات
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border px-5 py-2 text-base sm:text-lg transition-colors hover:bg-primary/10"
          >
            مشاوره رایگان
          </Link>
        </div>
      </div>
    </div>
  );
}
