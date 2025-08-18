# قوانین و ساختار پروژه

این سند قوانین فعلی UI/UX، معماری، و قراردادهای API داخلی را مشخص می‌کند تا توسعه آینده همسو و بدون تناقض انجام شود.

## تکنولوژی‌ها
- Next.js (App Router)
- React + TypeScript (strict)
- Tailwind CSS
- زبان و جهت: فارسی (RTL) در کل سایت

## ساختار مسیرها و پوشه‌ها
- صفحات: `front/app/*/page.tsx`
- لایه اصلی: `front/app/layout.tsx`
- API داخلی: `front/app/api/**/route.ts`
- کامپوننت‌ها: `front/components/*`
- داده موقت (نمونه): `front/app/**/data.ts`

## ناوبری و هدر
- فایل: `front/components/Navbar.tsx`
- وسط‌چین بودن منوی دسکتاپ حفظ شود
- لینک‌های اصلی: خانه، محصولات، پروژه‌ها، وبلاگ، سوالات متداول، درباره ما، تماس با ما
- آیکون حساب کاربری به `/account`
- پس‌زمینه هدر با اسکرول «شفاف → پس‌زمینه» سوئیچ می‌کند

## احراز هویت (Auth)
- صفحه اصلی: `front/app/auth/page.tsx` - شامل فرم‌های لاگین، ریجستر و فراموشی رمز عبور
- طراحی: سایدبار سمت راست با لوگو و منوی انتخاب فرم، محتوای اصلی سمت چپ
- صفحات قدیمی: `/login` و `/register` به `/auth` redirect می‌شوند
- API endpoints:
  - POST `/api/account/login` - ورود کاربر
  - POST `/api/account/register` - ثبت‌نام کاربر
  - POST `/api/account/forgot` - فراموشی رمز عبور
- ویژگی‌ها:
  - اعتبارسنجی سمت کلاینت
  - نمایش/مخفی کردن رمز عبور
  - حالت بارگذاری
  - انتقال خودکار ایمیل به فرم لاگین پس از ثبت‌نام

## پس‌زمینه نئون (NeonParticlesBackground)
- فایل: `front/components/NeonParticlesBackground.tsx`
- تعداد ذرات ریسپانسیو:
  - موبایل (< 768px): 30 ذره
  - تبلت (768px - 1024px): 60 ذره
  - دسکتاپ (> 1024px): 100 ذره
- ویژگی‌ها: تعامل با موس، خطوط اتصال، افکت glow

## الگوی صفحات با اسکرول کنترل‌شده (NoScroll)
- صفحات: خانه، محصولات، پروژه‌ها، وبلاگ، سوالات متداول، درباره ما، تماس با ما
- استفاده از `NoScroll` فقط در دسکتاپ و کنترل overflow در کانتینر اصلی

## محصولات
- لیست محصولات: صفحه `front/app/products/page.tsx` دیتارا از API داخلی `/api/products` می‌گیرد
- جزئیات محصول: `front/app/products/[id]/page.tsx` (در آینده به `/api/products/:id` متصل شود)
- تب‌ها و اطلاعات فنی: `ProductTabs.tsx`
- محصولات مرتبط: `RelatedProducts.tsx`
- قرارداد API
  - GET `/api/products?subcategories=a,b,c` → `{ items: Product[] }`

## پروژه‌ها
- لیست: `front/app/projects/page.tsx` از `/api/projects` با فیلتر زیر‌دسته
- قرارداد API: GET `/api/projects?subcategories=a,b,c` → `{ items: Project[] }`

## وبلاگ
- لیست: `front/app/blog/page.tsx` از `/api/blog` با فیلتر زیر‌دسته
- قرارداد API: GET `/api/blog?subcategories=a,b,c` → `{ items: BlogPost[] }`

## حساب کاربری
- داشبورد: `front/app/account/page.tsx`
- سفارشات: لیست/جزئیات از `/api/account/orders` و `/api/account/orders/:id`
- اشتراک‌ها: لیست/جزئیات از `/api/account/subscriptions` و `/api/account/subscriptions/:id`
- کدهای تخفیف: لیست از `/api/account/coupons`
- تیکت‌ها: لیست/ایجاد از `/api/account/tickets` (GET/POST)
- سبد خرید: لیست/حذف از `/api/account/cart` (GET/DELETE?id=...)`
- تغییر رمز: POST `/api/account/change-password`
- احراز هویت: POST `/api/account/login`, `/api/account/register`, `/api/account/forgot`
- قراردادهای API
  - لیست‌ها: `{ items: T[] }`
  - جزئیات: `{ item: T }`
  - اکشن موفق: `{ ok: true }`

## پنل ادمین
- ناوبری: `front/components/AdminSidebar.tsx` + داشبورد `front/app/admin/page.tsx`
- کاربران: `/api/admin/users` (GET، در آینده CRUD) + `front/app/admin/users/page.tsx`
- سفارشات: `/api/admin/orders` + `front/app/admin/orders/page.tsx`
- مقاله‌ها: `/api/admin/articles` + `front/app/admin/articles/page.tsx`
- پروژه‌ها: `/api/admin/projects` + `front/app/admin/projects/page.tsx`
- تیکت‌ها: `/api/admin/tickets` + `front/app/admin/tickets/page.tsx`
- مالی: `/api/admin/finance` + `front/app/admin/finance/page.tsx`
- کدهای تخفیف (ادمین): `front/app/admin/coupons/page.tsx` (فعلاً خواندن از `/api/account/coupons`؛ پیشنهاد: `/api/admin/coupons` برای CRUD کامل)
- ورود ادمین: POST `/api/admin/login` + صفحه `front/app/admin/login/page.tsx`
- الگوهای UI: جدول با حالت‌های «در حال بارگذاری…» و «بدون داده»، فرم‌های ایجاد/ویرایش با اعتبارسنجی سمت کلاینت

## قراردادهای عمومی API داخلی
- خروجی لیست: `{ items: Array }`
- خروجی آیتم: `{ item: Object }`
- خطا: `{ error: string }` + status مناسب (۴۰۰/۴۰۴/۵۰۰)
- Cache: پیش‌فرض `no-store` برای داده داینامیک UI

## قوانین نام‌گذاری و کدنویسی
- TypeScript strict، نام‌های توصیفی
- کنترل خطا و حالت‌های بارگذاری/خالی در UI
- اجتناب از console.log/debugger در کد نهایی
- راست‌به‌چپ بودن تایپوگرافی و چینش
- استفاده از Tailwind CSS برای استایل‌دهی
- کامپوننت‌های ریسپانسیو با breakpoint های استاندارد

## مسیرهای قابل ارتقا (اتصال بک‌اند واقعی)
- `products/[id]` → افزودن `/api/products/:id`
- `admin/coupons` → ایجاد `/api/admin/coupons` (GET/POST/PATCH/DELETE)
- `admin/products` → ایجاد `/api/admin/products` برای CRUD محصولات
- `auth` → اتصال به سیستم احراز هویت واقعی
- `NeonParticlesBackground` → بهینه‌سازی بیشتر برای عملکرد بهتر

## نکات مهم
- تمام فرم‌ها باید اعتبارسنجی سمت کلاینت داشته باشند
- حالت‌های بارگذاری در تمام عملیات async نمایش داده شود
- پیام‌های خطا به زبان فارسی و کاربرپسند باشند
- طراحی ریسپانسیو برای تمام صفحات الزامی است
