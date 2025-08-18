import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "ایمیل الزامی است" },
        { status: 400 }
      );
    }

    // بررسی فرمت ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "فرمت ایمیل نامعتبر است" },
        { status: 400 }
      );
    }

    // در اینجا باید کد ارسال ایمیل بازنشانی رمز عبور قرار گیرد
    // برای مثال:
    // 1. تولید توکن بازنشانی
    // 2. ذخیره توکن در دیتابیس با تاریخ انقضا
    // 3. ارسال ایمیل با لینک بازنشانی
    
    // فعلاً فقط پیام موفقیت برمی‌گردانیم
    console.log(`درخواست بازنشانی رمز عبور برای ایمیل: ${email}`);

    return NextResponse.json(
      { message: "ایمیل بازنشانی رمز عبور ارسال شد" },
      { status: 200 }
    );

  } catch (error) {
    console.error("خطا در پردازش درخواست فراموشی رمز عبور:", error);
    return NextResponse.json(
      { error: "خطا در پردازش درخواست" },
      { status: 500 }
    );
  }
}


