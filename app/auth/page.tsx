"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { loginUser, registerUser } from "@/lib/auth";
import { validateLoginForm, validateRegisterForm, getFieldError, ValidationError } from "@/lib/validation";
import { useAuth } from "@/contexts/AuthContext";

type FormType = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [activeForm, setActiveForm] = useState<FormType>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<ValidationError[]>([]);
  const [registerErrors, setRegisterErrors] = useState<ValidationError[]>([]);
  const [loginGeneralError, setLoginGeneralError] = useState<string | null>(null);
  const [registerGeneralError, setRegisterGeneralError] = useState<string | null>(null);
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState<string | null>(null);

  // فرم لاگین
  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
    remember: true
  });
  const [showLoginPass, setShowLoginPass] = useState(false);

  // فرم ریجستر
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showRegisterPass, setShowRegisterPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // تابع لاگین
  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginErrors([]);
    setLoginGeneralError(null);

    // اعتبارسنجی فرم
    const validationErrors = validateLoginForm(loginData);
    if (validationErrors.length > 0) {
      setLoginErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginUser(loginData);
      
      if (result.success && result.user) {
        login(result.user);
        // ریدایرکت بر اساس رول کاربر
        if (result.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/account");
        }
      } else {
        setLoginGeneralError(result.message || "ورود ناموفق بود. لطفاً اطلاعات خود را بررسی کنید.");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "خطا در ارتباط با سرور.";
      setLoginGeneralError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // تابع ریجستر
  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setRegisterErrors([]);
    setRegisterGeneralError(null);
    setRegisterSuccessMessage(null);
    
    // اعتبارسنجی فرم
    const validationErrors = validateRegisterForm(registerData);
    if (validationErrors.length > 0) {
      setRegisterErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerUser(registerData);
      
      if (result.success) {
        setRegisterSuccessMessage("ثبت‌نام با موفقیت انجام شد. لطفاً وارد شوید.");
        setTimeout(() => {
          setActiveForm("login");
        }, 2000);
      } else {
        setRegisterGeneralError(result.message || "ثبت‌نام ناموفق بود. لطفاً اطلاعات خود را بررسی کنید.");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "خطا در ارتباط با سرور.";
      setRegisterGeneralError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-transparent p-3">
      <div className="max-w-2xl w-full">
        <div className="bg-background border border-border rounded-3xl shadow-2xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 relative py-4">
            
            {/* فرم ثبت‌نام - سمت چپ */}
            <div className={`p-4 items-center justify-center relative bg-transparent z-10 ${activeForm === "register" ? "flex" : "hidden"} lg:flex`}>
              <div className="w-full max-w-[18rem]">
                <div className="text-center mb-4">
                  <h1 className="text-xl font-bold text-foreground mb-1.5">ثبت‌نام کنید</h1>
                  <p className="text-foreground/70 text-sm">حساب کاربری جدید ایجاد کنید</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-3">
                  {registerGeneralError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {registerGeneralError}
                    </div>
                  )}
                  
                  {registerSuccessMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                      {registerSuccessMessage}
                    </div>
                  )}
                  
                  <div>
                    <input
                      type="text"
                      placeholder="نام و نام خانوادگی"
                      value={registerData.name}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full rounded-xl border px-4 py-2.5 bg-background text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/50 ${
                        getFieldError(registerErrors, 'name') ? 'border-red-300' : 'border-border'
                      }`}
                    />
                    {getFieldError(registerErrors, 'name') && (
                      <p className="mt-1 text-xs text-red-600">{getFieldError(registerErrors, 'name')}</p>
                    )}
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      placeholder="ایمیل"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full rounded-xl border px-4 py-2.5 bg-background text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/50 ${
                        getFieldError(registerErrors, 'email') ? 'border-red-300' : 'border-border'
                      }`}
                    />
                    {getFieldError(registerErrors, 'email') && (
                      <p className="mt-1 text-xs text-red-600">{getFieldError(registerErrors, 'email')}</p>
                    )}
                  </div>
                  
                  <div>
                    <input
                      type="tel"
                      placeholder="شماره تلفن"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                      className={`w-full rounded-xl border px-4 py-2.5 bg-background text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/50 ${
                        getFieldError(registerErrors, 'phone') ? 'border-red-300' : 'border-border'
                      }`}
                    />
                    {getFieldError(registerErrors, 'phone') && (
                      <p className="mt-1 text-xs text-red-600">{getFieldError(registerErrors, 'phone')}</p>
                    )}
                  </div>
                  
                  <div className="relative">
                    <input
                      type={showRegisterPass ? "text" : "password"}
                      placeholder="رمز عبور"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      className={`w-full rounded-xl border px-4 py-2.5 pr-12 bg-background text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/50 ${
                        getFieldError(registerErrors, 'password') ? 'border-red-300' : 'border-border'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPass(!showRegisterPass)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-foreground/10 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showRegisterPass ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        )}
                      </svg>
                    </button>
                    {getFieldError(registerErrors, 'password') && (
                      <p className="mt-1 text-xs text-red-600">{getFieldError(registerErrors, 'password')}</p>
                    )}
                  </div>
                  
                  <div className="relative">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      placeholder="تکرار رمز عبور"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`w-full rounded-xl border px-4 py-2.5 pr-12 bg-background text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/50 ${
                        getFieldError(registerErrors, 'confirmPassword') ? 'border-red-300' : 'border-border'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-foreground/10 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showConfirmPass ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        )}
                      </svg>
                    </button>
                    {getFieldError(registerErrors, 'confirmPassword') && (
                      <p className="mt-1 text-xs text-red-600">{getFieldError(registerErrors, 'confirmPassword')}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-gradient-to-r from-primary to-accent text-white py-2.5 font-semibold hover:from-primary-light hover:to-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
                  </button>
                </form>
              </div>
            </div>

            {/* فرم ورود - سمت راست */}
            <div className={`p-4 items-center justify-center relative bg-transparent z-10 ${activeForm === "login" ? "flex" : "hidden"} lg:flex`}>
              <div className="w-full max-w-[18rem]">
                <div className="text-center mb-4">
                  <h1 className="text-xl font-bold text-foreground mb-1.5">سلام دوباره!</h1>
                  <p className="text-foreground/70 text-sm">خوش آمدید، دلتنگتان بودیم!</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-3">
                  {loginGeneralError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {loginGeneralError}
                    </div>
                  )}
                  
                  <div>
                    <input
                      type="text"
                      placeholder="ایمیل یا شماره تلفن"
                      value={loginData.identifier}
                      onChange={(e) => setLoginData(prev => ({ ...prev, identifier: e.target.value }))}
                      className={`w-full rounded-xl border px-4 py-2.5 bg-background text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/50 ${
                        getFieldError(loginErrors, 'identifier') ? 'border-red-300' : 'border-border'
                      }`}
                    />
                    {getFieldError(loginErrors, 'identifier') && (
                      <p className="mt-1 text-xs text-red-600">{getFieldError(loginErrors, 'identifier')}</p>
                    )}
                  </div>
                  
                  <div className="relative">
                    <input
                      type={showLoginPass ? "text" : "password"}
                      placeholder="رمز عبور"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className={`w-full rounded-xl border px-4 py-2.5 pr-12 bg-background text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/50 ${
                        getFieldError(loginErrors, 'password') ? 'border-red-300' : 'border-border'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPass(!showLoginPass)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-foreground/10 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showLoginPass ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        )}
                      </svg>
                    </button>
                    {getFieldError(loginErrors, 'password') && (
                      <p className="mt-1 text-xs text-red-600">{getFieldError(loginErrors, 'password')}</p>
                    )}
                  </div>

                  <div className="text-right">
                    <Link href="/auth/forgot" className="text-primary hover:text-primary-light transition-colors text-sm">
                      فراموشی رمز عبور؟
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-gradient-to-r from-primary to-accent text-white py-2.5 font-semibold hover:from-primary-light hover:to-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? "در حال ورود..." : "ورود"}
                  </button>
                </form>

                {/* بخش شبکه‌های اجتماعی حذف شد */}
              </div>
            </div>

            {/* کشویی آبی - نصف اندازه، روی یک فرم */}
            <div className={`hidden lg:block absolute top-0 bottom-0 left-0 w-1/2 bg-[#00020b] transition-transform duration-700 ease-in-out z-20 ${
              activeForm === "register" ? "translate-x-0" : "translate-x-full"
            }`}>
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="flex items-center justify-center mx-auto">
                    <Image src="/logo.png" alt="لوگو وب‌کدینو" width={840} height={240} priority className="h-56 w-auto" />
                  </div>
                </div>
              </div>
            </div>

            {/* دکمه‌های تغییر حالت */}
            <div className="absolute top-6 left-6 z-30">
              <button
                onClick={() => setActiveForm("register")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeForm === "register" 
                    ? "bg-white/20 text-white" 
                    : "bg-background/80 text-foreground hover:bg-background"
                }`}
              >
                ثبت‌نام
              </button>
            </div>
            <div className="absolute top-6 right-6 z-30">
              <button
                onClick={() => setActiveForm("login")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeForm === "login" 
                    ? "bg-white/20 text-white" 
                    : "bg-background/80 text-foreground hover:bg-background"
                }`}
              >
                ورود
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
