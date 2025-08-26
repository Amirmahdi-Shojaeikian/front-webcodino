import type { MetadataRoute } from "next";
import { allProducts } from "@/app/products/data";
import { aboutItems } from "@/app/about/data";
import { faqs } from "@/app/faq/data";

const RAW_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const BASE_URL = RAW_BASE_URL.replace(/\/$/, "");

export const dynamic = "force-static";
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // صفحات عمومی ثابت
  const staticPaths: string[] = [
    "/",
    "/about",
    "/faq",
    "/products",
    "/projects",
    "/contact",
  ];

  // مسیرهای داینامیک عمومی
  const productDetailPaths = allProducts.map((p) => `/products/${p.id}`);
  const aboutDetailPaths = aboutItems.map((i) => `/about/${i.slug}`);
  const faqDetailPaths = faqs.map((f) => `/faq/${f.slug}`);

  // مسیرهای فیلتر محصولات (URL-friendly)
  const productFilterPaths = [
    "/products/company-site",
    "/products/shop", 
    "/products/medical",
    "/products/blog",
    "/products/cv",
    "/products/shop-app",
    "/products/service-app", 
    "/products/medical-app",
    "/products/company-app",
    "/products/telegram-bot",
    "/products/instagram-bot",
    "/products/bale-bot",
    "/products/content-services",
    "/products/content-management",
    "/products/photo-editing",
    "/products/video-reels",
    "/products/additional-services",
  ];

  const allPaths = [
    ...staticPaths,
    ...productDetailPaths,
    ...aboutDetailPaths,
    ...faqDetailPaths,
    ...productFilterPaths,
  ];

  const uniquePaths = Array.from(new Set(allPaths));

  return uniquePaths.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : path.startsWith("/products") ? 0.8 : 0.7,
  }));
}


