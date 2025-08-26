"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/lib/auth";
import { validateLoginForm, getFieldError, ValidationError } from "@/lib/validation";
import { useAuth } from "@/contexts/AuthContext";
import Notification from "@/components/Notification";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
    remember: true
  });

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setGeneralError(null);
    setSuccessMessage(null);

    // اعتبارسنجی فرم
    const validationErrors = validateLoginForm(loginData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginUser(loginData);
      
      console.log('Login result:', result); // Debug log
      
      if (result.success && result.user) {
        login(result.user);
        
        // نمایش پیغام موفقیت
        setSuccessMessage("ورود با موفقیت انجام شد!");
        
        console.log('User role:', result.user.role); // Debug log
        
        // انتظار کوتاه برای نمایش پیغام موفقیت
        setTimeout(() => {
          if (result.user!.role === "admin") {
            console.log('Redirecting to /admin');
            router.push("/admin");
          } else {
            console.log('Redirecting to /account');
            router.push("/account");
          }
        }, 1500);
      } else {
        setGeneralError(result.message || "ورود ناموفق بود. لطفاً اطلاعات خود را بررسی کنید.");
        // حذف پیام خطا بعد از 5 ثانیه
        setTimeout(() => setGeneralError(null), 5000);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "خطا در ارتباط با سرور.";
      // بررسی خطای کاربر ثبت‌نام نکرده
      if (errorMessage && errorMessage.includes('یافت نشد') || errorMessage.includes('not found') || errorMessage.includes('ثبت‌نام')) {
        setGeneralError("کاربری با این اطلاعات یافت نشد. لطفاً ابتدا ثبت‌نام کنید.");
      } else {
        setGeneralError(errorMessage);
        // حذف پیام خطا بعد از 5 ثانیه
        setTimeout(() => setGeneralError(null), 5000);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">ورود به حساب</h2>
            <p className="text-gray-600">خوش آمدید! لطفاً اطلاعات خود را وارد کنید</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
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
                autoDismiss={false}
              />
            )}
            
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                ایمیل یا شماره تلفن
              </label>
              <input
                id="identifier"
                type="text"
                required
                value={loginData.identifier}
                onChange={(e) => setLoginData({...loginData, identifier: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  getFieldError(errors, 'identifier') ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="ایمیل یا شماره تلفن خود را وارد کنید"
              />
              {getFieldError(errors, 'identifier') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError(errors, 'identifier')}</p>
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
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    getFieldError(errors, 'password') ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="رمز عبور خود را وارد کنید"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={loginData.remember}
                  onChange={(e) => setLoginData({...loginData, remember: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="mr-2 block text-sm text-gray-700">
                  مرا به خاطر بسپار
                </label>
              </div>
              <Link href="/auth/forgot" className="text-sm text-blue-600 hover:text-blue-500">
                فراموشی رمز؟
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  در حال ورود...
                </div>
              ) : (
                "ورود"
              )}
            </button>
          </form>

          {/* بخش شبکه‌های اجتماعی حذف شد */}

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              حساب کاربری ندارید؟{" "}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                ثبت‌نام کنید
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
