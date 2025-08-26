"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import NoScroll from "@/components/NoScroll";
import { submitContact } from "@/lib/contact";
import Notification from "@/components/Notification";

export default function ContactPage() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    const handle = () => setIsDesktop(window.innerWidth >= 768);
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    const phoneRegex = /^(\+98|0)?9\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMsg("لطفا شماره موبایل معتبر وارد کنید");
      return;
    }
    try {
      setLoading(true);
      const res = await submitContact({ name, email, phone, subject, description });
      if (res.success) {
        setSuccessMsg(res.message || "پیام شما با موفقیت ارسال شد");
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setDescription("");
        // حذف پیام موفقیت بعد از 5 ثانیه
        setTimeout(() => setSuccessMsg(""), 5000);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "خطا در ارسال پیام تماس";
      setErrorMsg(errorMessage);
      // حذف پیام خطا بعد از 5 ثانیه
      setTimeout(() => setErrorMsg(""), 5000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-6 sm:mt-8">
      {isDesktop && <NoScroll />}
      <div className="grid grid-cols-1 md:grid-cols-[23%_77%] gap-6">
        {/* ستون راست: اطلاعات تماس */}
        <aside className="border rounded-2xl p-5 md:h-[70vh] md:overflow-y-auto flex flex-col items-center gap-3 [direction:ltr] order-2 md:order-none bg-background/20 backdrop-blur-sm pt-4 md:pt-6">
          <div className="[direction:rtl] w-full flex flex-col items-center gap-3 text-center">
            <Image src="/logo.png" alt="لوگو وب‌کدینو" width={840} height={240} className="h-40 w-auto max-w-full" />
            <div className="w-full space-y-2 text-base sm:text-lg">
              <div>
                <div className="text-foreground/70">تلفن:</div>
                <a href="tel:09030882522" className="text-blue-600 hover:underline">09030882522</a>
              </div>
              <div>
                <div className="text-foreground/70">ایمیل:</div>
                <a href="mailto:info@webcodino.ir" className="text-blue-600 hover:underline">info@webcodino.ir</a>
              </div>
            </div>
            <div className="w-full">
              <h3 className="text-sm font-semibold mb-2 text-foreground/70 text-center">شبکه‌های اجتماعی</h3>
              <div className="flex items-center justify-center gap-3">
                <Link href="#" aria-label="تلگرام" title="تلگرام" className="rounded-lg border p-2 hover:bg-blue-50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22l-4-9-9-4 20-7z" />
                  </svg>
                </Link>
                <Link href="#" aria-label="اینستاگرام" title="اینستاگرام" className="rounded-lg border p-2 hover:bg-blue-50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
                    <path d="M16 11.37A4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
                  </svg>
                </Link>
                <Link href="#" aria-label="لینکدین" title="لینکدین" className="rounded-lg border p-2 hover:bg-blue-50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="8" y1="11" x2="8" y2="16" />
                    <line x1="8" y1="8" x2="8" y2="8" />
                    <path d="M12 16v-3a2 2 0 0 1 4 0v3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* ستون چپ: فرم تماس */}
        <main className="order-1 md:order-none border rounded-2xl p-5 md:h-[70vh] md:overflow-y-auto [direction:rtl] bg-background/20 backdrop-blur-sm">
          <div className="[direction:rtl]">
            <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {successMsg && (
                <div className="sm:col-span-2">
                  <Notification
                    type="success"
                    message={successMsg}
                    onClose={() => setSuccessMsg("")}
                    autoDismiss={true}
                  />
                </div>
              )}
              {errorMsg && (
                <div className="sm:col-span-2">
                  <Notification
                    type="error"
                    message={errorMsg}
                    onClose={() => setErrorMsg("")}
                    autoDismiss={true}
                  />
                </div>
              )}
              <div className="sm:col-span-1">
                <label className="block text-base sm:text-lg mb-1">نام و نام خانوادگی</label>
                <input required className="w-full rounded-lg border px-3 py-2 bg-transparent" placeholder="مثال: علی رضایی" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-base sm:text-lg mb-1">ایمیل</label>
                <input type="email" required className="w-full rounded-lg border px-3 py-2 bg-transparent" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-base sm:text-lg mb-1">شماره تماس</label>
                <input required className="w-full rounded-lg border px-3 py-2 bg-transparent" placeholder="0912xxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-base sm:text-lg mb-1">موضوع</label>
                <select required value={subject} onChange={(e) => setSubject(e.target.value)} dir="rtl" className="block w-full min-w-0 rounded-lg border px-3 py-2 bg-transparent text-right">
                  <option value="" disabled className="text-black" style={{ color: "#000" }}>انتخاب کنید...</option>
                  <option value="consult" className="text-black" style={{ color: "#000" }}>مشاوره</option>
                  <option value="support" className="text-black" style={{ color: "#000" }}>پشتیبانی</option>
                  <option value="cooperation" className="text-black" style={{ color: "#000" }}>پیشنهاد همکاری</option>
                  <option value="order" className="text-black" style={{ color: "#000" }}>سفارش پروژه</option>
                  <option value="other" className="text-black" style={{ color: "#000" }}>سایر</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-base sm:text-lg mb-1">متن پیام</label>
                <textarea required rows={6} className="w-full rounded-lg border px-3 py-2 bg-transparent" placeholder="متن پیام شما..." value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button type="submit" disabled={loading} className="rounded-xl bg-blue-600 text-white px-5 py-2 text-base sm:text-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? "در حال ارسال..." : "ارسال پیام"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}


