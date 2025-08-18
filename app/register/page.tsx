"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/auth";
import { validateRegisterForm, getFieldError, ValidationError } from "@/lib/validation";
import Notification from "@/components/Notification";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    nationalCode: "",
    password: "",
    confirmPassword: ""
  });

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setGeneralError(null);
    setSuccessMessage(null);
    
    // اعتبارسنجی فرم
    const validationErrors = validateRegisterForm(registerData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerUser(registerData);
      
      if (result.success) {
        setSuccessMessage("ثبت‌نام با موفقیت انجام شد. لطفاً وارد شوید.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setGeneralError(result.message || "ثبت‌نام ناموفق بود. لطفاً اطلاعات خود را بررسی کنید.");
        // حذف پیام خطا بعد از 5 ثانیه
        setTimeout(() => setGeneralError(null), 5000);
      }
    } catch (error: any) {
      setGeneralError(error.message || "خطا در ارتباط با سرور.");
      // حذف پیام خطا بعد از 5 ثانیه
      setTimeout(() => setGeneralError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">ثبت‌نام</h2>
            <p className="text-gray-600">حساب کاربری جدید ایجاد کنید</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-6">
            {generalError && (
              <Notification
                type="error"
                message={generalError}
                onClose={() => setGeneralError(null)}
                autoDismiss={true}
              />
            )}
            
            {successMessage && (
              <Notification
                type="success"
                message={successMessage}
                onClose={() => setSuccessMessage(null)}
                autoDismiss={true}
              />
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                نام و نام خانوادگی
              </label>
              <input
                id="name"
                type="text"
                required
                value={registerData.name}
                onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                  getFieldError(errors, 'name') ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="نام و نام خانوادگی"
              />
              {getFieldError(errors, 'name') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError(errors, 'name')}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                ایمیل
              </label>
              <input
                id="email"
                type="email"
                required
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                  getFieldError(errors, 'email') ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="آدرس ایمیل"
              />
              {getFieldError(errors, 'email') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError(errors, 'email')}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                شماره تلفن
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={registerData.phone}
                onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                  getFieldError(errors, 'phone') ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="شماره تلفن همراه"
              />
              {getFieldError(errors, 'phone') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError(errors, 'phone')}</p>
              )}
            </div>

            <div>
              <label htmlFor="nationalCode" className="block text-sm font-medium text-gray-700 mb-2">
                کد ملی
              </label>
              <input
                id="nationalCode"
                type="text"
                required
                maxLength={10}
                value={registerData.nationalCode}
                onChange={(e) => setRegisterData({...registerData, nationalCode: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                  getFieldError(errors, 'nationalCode') ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="کد ملی 10 رقمی"
              />
              {getFieldError(errors, 'nationalCode') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError(errors, 'nationalCode')}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    getFieldError(errors, 'password') ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="رمز عبور (حداقل 6 کاراکتر)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {getFieldError(errors, 'password') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError(errors, 'password')}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                تکرار رمز عبور
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    getFieldError(errors, 'confirmPassword') ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="تکرار رمز عبور"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {getFieldError(errors, 'confirmPassword') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError(errors, 'confirmPassword')}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  در حال ثبت‌نام...
                </div>
              ) : (
                "ثبت‌نام"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              قبلاً حساب کاربری دارید؟{" "}
              <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
                ورود کنید
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
