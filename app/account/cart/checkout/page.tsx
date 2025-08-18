export default function CheckoutPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">تکمیل سفارش</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-3">اطلاعات پرداخت</h2>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">نام و نام خانوادگی</label>
              <input className="w-full rounded-lg border px-3 py-2 bg-transparent" placeholder="مثال: علی رضایی" />
            </div>
            <div>
              <label className="block text-sm mb-1">ایمیل</label>
              <input type="email" className="w-full rounded-lg border px-3 py-2 bg-transparent" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm mb-1">شماره تلفن</label>
              <input className="w-full rounded-lg border px-3 py-2 bg-transparent" placeholder="0912xxxxxxx" />
            </div>
            <div>
              <label className="block text-sm mb-1">کد ملی</label>
              <input className="w-full rounded-lg border px-3 py-2 bg-transparent" placeholder="مثال: 0012345678" />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button className="rounded-xl bg-blue-600 text-white px-5 py-2 text-base hover:bg-blue-700">پرداخت</button>
            </div>
          </form>
        </div>
        <aside className="border rounded-xl p-5 h-max">
          <h2 className="text-lg font-semibold mb-3">خلاصه سفارش</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>هاست ایرانی پایه</span><span>۵۰,۰۰۰</span></li>
            <li className="flex justify-between"><span>سرور خارجی اختصاصی</span><span>۹۰۰,۰۰۰</span></li>
            <li className="flex justify-between"><span>طراحی سایت فروشگاهی</span><span>۲,۰۰۰,۰۰۰</span></li>
          </ul>
          <div className="mt-3 border-t pt-3 flex justify-between font-bold">
            <span>جمع کل</span>
            <span>۲,۹۵۰,۰۰۰ تومان</span>
          </div>
        </aside>
      </div>
    </section>
  );
}


