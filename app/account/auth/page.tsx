"use client";

import { FormEvent, useState } from "react";

export default function AccountAuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalCode: "",
    phone: "",
    email: ""
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // اعتبارسنجی
    if (!formData.firstName.trim()) {
      alert("نام الزامی است.");
      return;
    }
    
    if (!formData.lastName.trim()) {
      alert("نام خانوادگی الزامی است.");
      return;
    }
    
    if (!formData.nationalCode.trim()) {
      alert("کد ملی الزامی است.");
      return;
    }
    
    if (!formData.phone.trim()) {
      alert("شماره تلفن الزامی است.");
      return;
    }
    
    if (!formData.email.trim()) {
      alert("ایمیل الزامی است.");
      return;
    }

    try {
      setIsLoading(true);
      // شبیه‌سازی ارسال اطلاعات
      setTimeout(() => {
        alert("اطلاعات احراز هویت با موفقیت ثبت شد.");
        setIsLoading(false);
        // پاک کردن فرم
        setFormData({
          firstName: "",
          lastName: "",
          nationalCode: "",
          phone: "",
          email: ""
        });
      }, 1000);
    } catch {
      alert("خطا در ثبت اطلاعات.");
      setIsLoading(false);
    }
  }

  return (
    <section className="mt-6 sm:mt-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="bg-background border rounded-2xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">احراز هویت</h2>
            <p className="text-foreground/70">لطفاً اطلاعات خود را برای احراز هویت وارد کنید</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                  نام *
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="نام خود را وارد کنید"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                  نام خانوادگی *
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="نام خانوادگی خود را وارد کنید"
                />
              </div>
            </div>

            <div>
              <label htmlFor="nationalCode" className="block text-sm font-medium mb-2">
                کد ملی *
              </label>
              <input
                id="nationalCode"
                type="text"
                required
                maxLength={10}
                value={formData.nationalCode}
                onChange={(e) => setFormData({...formData, nationalCode: e.target.value})}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="کد ملی 10 رقمی"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                شماره تلفن *
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="شماره تلفن همراه"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                ایمیل *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="آدرس ایمیل"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  در حال ثبت...
                </div>
              ) : (
                "ثبت اطلاعات احراز هویت"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}


