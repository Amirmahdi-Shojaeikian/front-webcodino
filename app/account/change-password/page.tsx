"use client";

import { FormEvent, useState } from "react";

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = {
      current: String(form.get("current") ?? ""),
      next: String(form.get("next") ?? ""),
    };
    const confirm = String(form.get("confirm") ?? "");
    if (!body.current || !body.next) return;
    if (body.next !== confirm) {
      alert("تکرار رمز با رمز عبور جدید یکسان نیست.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) alert("رمز عبور با موفقیت تغییر کرد.");
      else alert("تغییر رمز ناموفق بود.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-center">تغییر رمز عبور</h1>
      <div className="flex justify-center">
        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-xl p-5 max-w-2xl bg-background">
        <div className="sm:col-span-2">
          <label className="block text-sm mb-1">رمز فعلی</label>
          <input name="current" type="password" required className="w-full rounded-lg border px-3 py-2 bg-transparent" />
        </div>
        <div>
          <label className="block text-sm mb-1">رمز جدید</label>
          <input name="next" type="password" required className="w-full rounded-lg border px-3 py-2 bg-transparent" />
        </div>
        <div>
          <label className="block text-sm mb-1">تکرار رمز جدید</label>
          <input name="confirm" type="password" required className="w-full rounded-lg border px-3 py-2 bg-transparent" />
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <button disabled={loading} className="rounded-xl bg-blue-600 text-white px-5 py-2 text-base hover:bg-blue-700 disabled:opacity-60">{loading ? "در حال ارسال..." : "ثبت تغییر"}</button>
        </div>
      </form>
        </div>
    </section>
  );
}


