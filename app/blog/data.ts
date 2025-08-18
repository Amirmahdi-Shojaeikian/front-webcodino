export type BlogPost = {
  id: number;
  title: string;
  desc: string;
  category: string;
  subcategory: string;
  readTime: string;
};

export const allPosts: BlogPost[] = [
  { id: 1, title: "آموزش Next.js از صفر", desc: "شروع سریع با App Router", category: "موضوع", subcategory: "آموزشی", readTime: "۷ دقیقه" },
  { id: 2, title: "ویدیو: بهینه‌سازی سئو در React", desc: "نکات عملی و ابزارها", category: "قالب", subcategory: "ویدیو", readTime: "۱۲ دقیقه" },
  { id: 3, title: "خبر: انتشار نسخه جدید Node.js", desc: "ویژگی‌های مهم نسخه اخیر", category: "موضوع", subcategory: "اخبار", readTime: "۴ دقیقه" },
  { id: 4, title: "راهنما: دیپلوی با Vercel", desc: "گام‌به‌گام برای پروژه‌های Next.js", category: "موضوع", subcategory: "راهنما", readTime: "۶ دقیقه" },
  { id: 5, title: "مقاله: معماری DevOps", desc: "الگوها و بهترین‌عمل‌ها", category: "قالب", subcategory: "مقاله", readTime: "۱۰ دقیقه" },
  { id: 6, title: "پادکست: آینده React", desc: "مصاحبه با متخصصین", category: "قالب", subcategory: "پادکست", readTime: "۱۵ دقیقه" },
  { id: 7, title: "Next.js پیشرفته", desc: "بهینه‌سازی پرفورمنس", category: "تکنولوژی", subcategory: "Next.js", readTime: "۹ دقیقه" },
];


