"use client";

import { useRouter } from "next/navigation";

type Props = {
  product: { id: number; title: string; price: string };
};

export default function AddToCartButton({ product }: Props) {
  const router = useRouter();

  function handleAdd() {
    try {
      const key = "wc_cart";
      const prev = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      const items: Array<{ id: number; title: string; price: string; qty: number }> = prev ? JSON.parse(prev) : [];
      const existing = items.find((i) => i.id === product.id);
      if (existing) existing.qty += 1;
      else items.push({ id: product.id, title: product.title, price: product.price, qty: 1 });
      window.localStorage.setItem(key, JSON.stringify(items));
    } catch {}

    const go = window.confirm("محصول به سبد خرید اضافه شد. آیا می‌خواهید به سبد خرید بروید؟");
    if (go) router.push("/account/cart");
  }

  return (
    <button onClick={handleAdd} className="w-full rounded-xl bg-blue-600 text-white px-5 py-2 text-base hover:bg-blue-700">
      افزودن به سبد
    </button>
  );
}


