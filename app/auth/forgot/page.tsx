"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/auth";
import { validateForgotPasswordForm, getFieldError, ValidationError } from "@/lib/validation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setMessage(null);

    // اعتبارسنجی فرم
    const validationErrors = validateForgotPasswordForm(email);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        setMessage("اگر ایمیل معتبری وارد کرده باشید، لینک بازنشانی ارسال شد.");
        setMessageType('success');
      } else {
        setMessage(result.message || "خطایی رخ داد.");
        setMessageType('error');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "خطا در ارتباط با سرور.";
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-transparent p-4">
      <div className="w-full max-w-md">
        <div className="bg-black/50 backdrop-blur-sm border border-border rounded-2xl shadow-2xl p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">فراموشی رمز عبور</h1>
            <p className="text-foreground/70 text-sm">ایمیل خود را وارد کنید تا لینک بازنشانی ارسال شود</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="ایمیل"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 bg-background text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/50 ${
                  getFieldError(errors, 'email') ? 'border-red-300' : 'border-border'
                }`}
              />
              {getFieldError(errors, 'email') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError(errors, 'email')}</p>
              )}
            </div>

            {message && (
              <div className={`text-center text-sm px-4 py-3 rounded-lg ${
                messageType === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-accent text-white py-3 font-semibold hover:from-primary-light hover:to-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? "در حال ارسال..." : "ارسال لینک بازنشانی"}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="/auth" className="text-primary hover:text-primary-light text-sm">
              بازگشت به ورود
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}




