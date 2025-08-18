import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "درباره ما | تیم وب کدینو",
  description: "وب کدینو تیمی حرفه‌ای در حوزه طراحی سایت، اپلیکیشن، سرور، هاست و تولید محتوا است.",
  keywords: "درباره وب کدینو, تیم طراحی سایت, تیم اپلیکیشن",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}



