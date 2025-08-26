import { allProducts } from './data';

// Mapping از نام فارسی به slug انگلیسی
export const productTitleToSlug: Record<string, string> = {
  // سایت‌ها
  "پکیج پایه سایت شرکتی": "basic-company-website",
  "پکیج حرفه‌ای سایت شرکتی": "professional-company-website", 
  "پکیج ویژه سایت شرکتی": "premium-company-website",
  "پکیج پایه فروشگاهی": "basic-ecommerce-website",
  "پکیج حرفه‌ای فروشگاهی": "professional-ecommerce-website",
  "پکیج ویژه فروشگاهی": "premium-ecommerce-website",
  "پکیج پایه پزشکی": "basic-medical-website",
  "پکیج حرفه‌ای پزشکی": "professional-medical-website",
  "پکیج ویژه پزشکی": "premium-medical-website",
  "پکیج پایه وبلاگی": "basic-blog-website",
  "پکیج حرفه‌ای وبلاگی": "professional-blog-website",
  "پکیج ویژه وبلاگی": "premium-blog-website",
  "پکیج پایه رزومه‌ای": "basic-cv-website",
  "پکیج حرفه‌ای رزومه‌ای": "professional-cv-website",
  "پکیج ویژه رزومه‌ای": "premium-cv-website",
  
  // اپلیکیشن‌ها
  "پکیج پایه اپلیکیشن فروشگاهی": "basic-shopping-app",
  "پکیج حرفه‌ای اپلیکیشن فروشگاهی": "professional-shopping-app",
  "پکیج ویژه اپلیکیشن فروشگاهی": "premium-shopping-app",
  "پکیج پایه اپلیکیشن خدماتی": "basic-service-app",
  "پکیج حرفه‌ای اپلیکیشن خدماتی": "professional-service-app",
  "پکیج ویژه اپلیکیشن خدماتی": "premium-service-app",
  "پکیج پایه اپلیکیشن پزشکی": "basic-medical-app",
  "پکیج حرفه‌ای اپلیکیشن پزشکی": "professional-medical-app",
  "پکیج ویژه اپلیکیشن پزشکی": "premium-medical-app",
  "پکیج پایه اپلیکیشن شرکتی": "basic-company-app",
  "پکیج حرفه‌ای اپلیکیشن شرکتی": "professional-company-app",
  "پکیج ویژه اپلیکیشن شرکتی": "premium-company-app",
  
  // ربات‌ها
  "پکیج پایه ربات تلگرام": "basic-telegram-bot",
  "پکیج حرفه‌ای ربات تلگرام": "professional-telegram-bot",
  "پکیج ویژه ربات تلگرام": "premium-telegram-bot",
  "پکیج پایه ربات اینستاگرام": "basic-instagram-bot",
  "پکیج حرفه‌ای ربات اینستاگرام": "professional-instagram-bot",
  "پکیج ویژه ربات اینستاگرام": "premium-instagram-bot",
  "پکیج پایه ربات بله": "basic-bale-bot",
  "پکیج حرفه‌ای ربات بله": "professional-bale-bot",
  "پکیج ویژه ربات بله": "premium-bale-bot",
  
  // تولید محتوا
  "پکیج پایه مدیریت و تولید محتوا": "basic-content-management",
  "پکیج حرفه‌ای مدیریت و تولید محتوا": "professional-content-management",
  "پکیج ویژه مدیریت و تولید محتوا": "premium-content-management",
  "پکیج پایه عکاسی و ادیت": "basic-photography-editing",
  "پکیج حرفه‌ای عکاسی و ادیت": "professional-photography-editing",
  "پکیج ویژه عکاسی و ادیت": "premium-photography-editing",
  "پکیج پایه ویدیو و ریلز": "basic-video-reels",
  "پکیج حرفه‌ای ویدیو و ریلز": "professional-video-reels",
  "پکیج ویژه ویدیو و ریلز": "premium-video-reels",
  "پکیج پایه خدمات جانبی": "basic-additional-services",
  "پکیج حرفه‌ای خدمات جانبی": "professional-additional-services",
  "پکیج ویژه خدمات جانبی": "premium-additional-services",
  "مدیریت و تولید محتوا": "content-management-services",
  "عکاسی و ادیت": "photography-editing-services",
  "ویدیو و ریلز": "video-reels-services",
  "خدمات جانبی": "additional-services",
  
  // محصولات قدیمی
  "سایت فروشگاهی": "ecommerce-website",
  "سایت شرکتی": "company-website",
  "وبلاگ حرفه‌ای": "professional-blog"
};

// Mapping از slug انگلیسی به نام فارسی
export const slugToProductTitle: Record<string, string> = Object.fromEntries(
  Object.entries(productTitleToSlug).map(([key, value]) => [value, key])
);

// تابع برای پیدا کردن محصول بر اساس slug
export function findProductBySlug(slug: string) {
  const persianTitle = slugToProductTitle[slug];
  if (!persianTitle) return null;
  
  return allProducts.find(product => product.title === persianTitle);
}

// تابع برای تولید slug از نام محصول
export function generateSlug(title: string): string {
  return productTitleToSlug[title] || title.toLowerCase().replace(/\s+/g, '-');
}

// تولید تمام slug های ممکن برای static generation
export function getAllProductSlugs() {
  return allProducts.map(product => ({
    slug: generateSlug(product.title)
  }));
}



