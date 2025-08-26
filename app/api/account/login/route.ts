import { NextResponse } from "next/server";

// POST /api/account/login
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { identifier, password } = body ?? {};
  
  if (!identifier || !password) {
    return NextResponse.json({ 
      success: false, 
      message: "اطلاعات ورود ناقص است" 
    }, { status: 400 });
  }
  
  // Mock authentication - در production باید با دیتابیس واقعی جایگزین شود
  if (password === "123456") {
    const isAdmin = identifier === "admin@test.com";
    
    return NextResponse.json({
      success: true,
      message: "ورود موفقیت‌آمیز بود",
      token: "mock-jwt-token-12345",
      user: {
        id: "user-123",
        name: isAdmin ? "مدیر سیستم" : "کاربر تست",
        email: identifier.includes("@") ? identifier : "user@test.com",
        phone: identifier.includes("@") ? "09123456789" : identifier,
        role: isAdmin ? "admin" : "user"
      }
    });
  }
  
  return NextResponse.json({
    success: false,
    message: "اطلاعات ورود اشتباه است"
  }, { status: 401 });
}


