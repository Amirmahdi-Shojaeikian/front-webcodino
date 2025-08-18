import ProductsClient from "./ProductsClient";
import { allProducts } from "./data";
import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "محصولات وب کدینو | طراحی سایت، اپلیکیشن، هاست و سرور",
  description: "لیست کامل محصولات و خدمات وب کدینو شامل طراحی وب‌سایت، اپلیکیشن موبایل، هاست، سرور و ربات.",
  keywords: "محصولات وب کدینو, طراحی وب, هاست, سرور, اپلیکیشن",
};

export default function ProductsPage() {
  // داده‌ها در بیلد دریافت و به کلاینت پاس می‌شوند تا صفحه کاملاً استاتیک باشد
  return <ProductsClient items={allProducts} />;
}


