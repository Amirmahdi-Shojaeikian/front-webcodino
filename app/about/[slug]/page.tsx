import Link from "next/link";
import { use } from "react";
import { aboutItems, findAboutItem } from "../data";
export const dynamic = "force-static";
export const revalidate = false;
export const dynamicParams = false;

export function generateStaticParams() {
  return aboutItems.map((i) => ({ slug: i.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export default function AboutDetailPage({ params }: Params) {
  const { slug } = use(params);
  const item = findAboutItem(slug);

  if (!item) {
    return (
      <section className="mx-auto max-w-3xl py-10 px-4">
        <h1 className="text-2xl font-bold mb-3">بخش موردنظر پیدا نشد</h1>
        <Link href="/about" className="text-blue-600 hover:underline">
          بازگشت به درباره ما
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl py-10 px-4 space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold">{item.title}</h1>
      <p className="text-base sm:text-lg text-foreground/80 leading-8">{item.content}</p>
      <div>
        <Link href="/about" className="inline-block rounded-lg border px-4 py-2 text-base hover:bg-blue-50">
          بازگشت
        </Link>
      </div>
    </section>
  );
}


