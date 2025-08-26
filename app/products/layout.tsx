import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "محصولات وب کدینو | طراحی سایت، اپلیکیشن، هاست و سرور",
  description: "لیست کامل محصولات و خدمات وب کدینو شامل طراحی وب‌سایت، اپلیکیشن موبایل، هاست، سرور و ربات. فیلتر محصولات بر اساس دسته‌بندی.",
  keywords: "محصولات وب کدینو, طراحی وب, هاست, سرور, اپلیکیشن, ربات, فیلتر محصولات",
  openGraph: {
    title: "محصولات وب کدینو | طراحی سایت، اپلیکیشن، هاست و سرور",
    description: "لیست کامل محصولات و خدمات وب کدینو شامل طراحی وب‌سایت، اپلیکیشن موبایل، هاست، سرور و ربات.",
    type: "website",
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "محصولات وب کدینو | طراحی سایت، اپلیکیشن، هاست و سرور",
    description: "لیست کامل محصولات و خدمات وب کدینو شامل طراحی وب‌سایت، اپلیکیشن موبایل، هاست، سرور و ربات.",
  },
  alternates: {
    canonical: "/products",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


