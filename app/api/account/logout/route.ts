import { NextResponse } from "next/server";
import { logoutUser } from "@/lib/auth";

// POST /api/account/logout
export async function POST() {
  try {
    // فراخوانی تابع logout از lib/auth
    await logoutUser();
    
    // پاسخ موفق
    return NextResponse.json({ 
      success: true, 
      message: "خروج با موفقیت انجام شد" 
    });
  } catch (error) {
    console.error("خطا در logout:", error);
    
    // حتی در صورت خطا، پاسخ موفق برگردانیم
    // چون logout محلی در lib/auth انجام می‌شود
    return NextResponse.json({ 
      success: true, 
      message: "خروج انجام شد" 
    });
  }
}


