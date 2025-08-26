import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import { allProducts } from "../data";
import { findProductBySlug, getAllProductSlugs } from "../slugMapping";
import ProductTabs from "../ProductTabs";
import RelatedProducts from "../RelatedProducts";

export const dynamic = "force-static";
export const revalidate = false;
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProductSlugs();
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = findProductBySlug(slug);
  
  if (!product) {
    return (
      <section className="py-10">
        <h1 className="text-2xl font-bold mb-3">محصول یافت نشد</h1>
        <Link href="/products" className="text-blue-600 hover:underline">بازگشت به محصولات</Link>
      </section>
    );
  }

  return (
    <section className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 border rounded-2xl p-6 bg-background">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.title}</h1>
        <p className="text-foreground/80 leading-8 mb-4">
          {product.desc} — این سرویس با تمرکز بر کیفیت و پایداری ارائه می‌شود. می‌توانید بسته به نیازتان،
          منابع و امکانات متنوعی را انتخاب کنید. پشتیبانی اختصاصی و امکان ارتقا در هر زمان فراهم است.
        </p>
        <ProductTabs product={product} showCompare={false} />
      </div>
      <aside className="border rounded-2xl p-6 h-max bg-background">
        {product.image && (
          <div className="flex justify-center mb-4">
            <Image src={product.image} alt={product.title} width={560} height={320} className="h-48 w-auto" />
          </div>
        )}

        
        {/* اطلاعات تماس */}
        <div className="mt-6">
          <div className="text-center mb-8">
            <Image src="/logo.png" alt="لوگو وب‌کدینو" width={840} height={240} className="h-32 w-auto mx-auto mb-5" />
            <h3 className="text-2xl font-bold mb-5">اطلاعات تماس</h3>
          </div>
          
          <div className="space-y-5 text-lg">
            <div className="text-center">
              <div className="text-foreground/70 mb-2 text-xl">تلفن:</div>
              <a href="tel:02112345678" className="text-blue-600 hover:underline text-xl font-medium">021-12345678</a>
            </div>
            <div className="text-center">
              <div className="text-foreground/70 mb-2 text-xl">ایمیل:</div>
              <a href="mailto:info@webcodino.ir" className="text-blue-600 hover:underline text-xl font-medium">info@webcodino.ir</a>
            </div>
          </div>
          
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4 text-foreground/70 text-center">شبکه‌های اجتماعی</h4>
            <div className="flex items-center justify-center gap-4">
              <Link href="#" aria-label="تلگرام" title="تلگرام" className="rounded-lg border p-4 hover:bg-blue-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
              </Link>
              <Link href="#" aria-label="اینستاگرام" title="اینستاگرام" className="rounded-lg border p-4 hover:bg-blue-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
                </svg>
              </Link>
              <Link href="#" aria-label="لینکدین" title="لینکدین" className="rounded-lg border p-4 hover:bg-blue-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="8" y1="11" x2="8" y2="16" />
                  <line x1="8" y1="8" x2="8" y2="8" />
                  <path d="M12 16v-3a2 2 0 0 1 4 0v3" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* دکمه مشاوره رایگان در پایین */}
          <div className="mt-8">
            <Link href="/contact" className="block w-full text-center rounded-xl border px-5 py-3 text-lg font-medium hover:bg-blue-50 transition-colors">
              مشاوره رایگان
            </Link>
          </div>
        </div>
      </aside>
      <div className="lg:col-span-3">
        <h2 className="text-xl font-bold mb-3">پیشنهادات مرتبط</h2>
        <RelatedProducts items={allProducts} currentProduct={product} />
      </div>
    </section>
  );
}


