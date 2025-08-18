export type Project = {
  id: number;
  title: string;
  desc: string;
  category: string;
  subcategory: string;
  price: string;
  link?: string;
  logo?: string;
};

export const allProjects: Project[] = [
  {
    id: 1,
    title: "FX Credito",
    desc: "تامین سرمایه و پرداخت وام، ویژه فعالان بازار فارکس، سهام بین‌الملل، ارزهای دیجیتال و کریپتو کارنسی",
    category: "مالی",
    subcategory: "وام و اعتبار",
    price: "تکمیل شده",
    link: "https://fxcredito.com/",
    logo: "/fx_logo.svg"
  },
  {
    id: 2,
    title: "Octane Oil",
    desc: "سایت فروشگاهی اکتان با ارائه خدمات متنوع در حوزه انرژی و سوخت",
    category: "فروشگاهی",
    subcategory: "انرژی و سوخت",
    price: "تکمیل شده",
    link: "https://octaneoll.com/",
    logo: "/octaneoll.png"
  },
  {
    id: 3,
    title: "KD Financial Academy",
    desc: "آکادمی مالی ارائه‌دهنده خدمات آموزشی و سیگنال‌های معاملاتی در بازارهای مالی",
    category: "آموزشی",
    subcategory: "مالی و سرمایه‌گذاری",
    price: "تکمیل شده",
    link: "https://kd-fa.com/",
    logo: "/kd_logo.svg"
  },
  {
    id: 4,
    title: "امتداد",
    desc: "مرکز تجربه‌نگاری امتداد با هدف شناسایی حلقه‌های میانی و تولید آثار مکتوب",
    category: "فرهنگی",
    subcategory: "تجربه‌نگاری",
    price: "تکمیل شده",
    link: "https://mtedad.org/",
    logo: "/metdad_logo.png"
  },
  {
    id: 5,
    title: "Body Aroma",
    desc: "اولین فروشگاه تخصصی بادی اسپلش و بادی لوشن‌های زنانه و مردانه با ارائه محصولات باکیفیت و اورجینال",
    category: "فروشگاهی",
    subcategory: "لوازم آرایشی و بهداشتی",
    price: "تکمیل شده",
    link: "https://bodyaroma.ir/",
    logo: "/logo-bodyaroma.png"
  }
];


