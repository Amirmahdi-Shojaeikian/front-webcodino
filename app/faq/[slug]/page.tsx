import Link from "next/link";
import { use } from "react";
import { faqs, findFaqBySlug } from "../data";
export const dynamic = "force-static";
export const revalidate = false;
export const dynamicParams = false;

export function generateStaticParams() {
  return faqs.map((f) => ({ slug: f.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export default function FAQDetailPage({ params }: Params) {
  const { slug } = use(params);
  const item = findFaqBySlug(slug);

  if (!item) {
    return (
      <section className="mx-auto max-w-3xl py-10 px-4">
        <h1 className="text-2xl font-bold mb-3">سوال پیدا نشد</h1>
        <Link href="/faq" className="text-blue-600 hover:underline">
          بازگشت به سوالات متداول
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl py-10 px-4 space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold">{item.question}</h1>
      <p className="text-base sm:text-lg text-foreground/80 leading-8">{item.answer}</p>
      <div>
        <Link href="/faq" className="inline-block rounded-lg border px-4 py-2 text-base hover:bg-blue-50">
          بازگشت
        </Link>
      </div>
    </section>
  );
}


