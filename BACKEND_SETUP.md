# راهنمای راه‌اندازی Backend برای فرم‌های Login و Register

## مراحل راه‌اندازی

### 1. تنظیم Environment Variables

فایل `.env.local` را در root پروژه ایجاد کنید:

```env
# Development
NEXT_PUBLIC_API_URL=https://server.webcodino.ir/api

# Production (جایگزین کنید با URL واقعی backend)
# NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

### 2. کانفیگ Backend

#### نصب Dependencies:
```bash
npm install express cors bcryptjs jsonwebtoken
```

#### فایل `backend-example.js` را اجرا کنید:
```bash
node backend-example.js
```

### 3. CORS Configuration

در backend، CORS را برای domain های frontend تنظیم کنید:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000', // Development
    'http://localhost:3001',
    'https://your-frontend-domain.com', // Production
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));
```

### 4. API Endpoints

Backend باید این endpoints را داشته باشد:

- `POST /api/auth/login` - ورود کاربر
- `POST /api/auth/register` - ثبت‌نام کاربر
- `GET /api/auth/me` - دریافت اطلاعات کاربر فعلی
- `POST /api/auth/logout` - خروج کاربر

### 5. Response Format

Backend باید response های زیر را برگرداند:

#### Login Success:
```json
{
  "success": true,
  "message": "ورود موفقیت‌آمیز بود",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "نام کاربر",
    "email": "user@example.com",
    "phone": "09123456789",
    "role": "user"
  }
}
```

#### Register Success:
```json
{
  "success": true,
  "message": "ثبت‌نام با موفقیت انجام شد",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "نام کاربر",
    "email": "user@example.com",
    "phone": "09123456789",
    "role": "user"
  }
}
```

#### Error Response:
```json
{
  "success": false,
  "message": "پیام خطا"
}
```

### 6. تست کردن

#### تست Backend:
```bash
# Health check
curl https://server.webcodino.ir/api/health

# Register
curl -X POST https://server.webcodino.ir/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"تست","email":"test@example.com","phone":"09123456789","password":"123456"}'

# Login
curl -X POST https://server.webcodino.ir/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@example.com","password":"123456"}'
```

#### تست Frontend:
1. سرور backend را اجرا کنید
2. سرور frontend را اجرا کنید: `npm run dev`
3. به `http://localhost:3000/login` بروید
4. فرم را تست کنید

### 7. Debugging

#### مشکلات رایج:

1. **CORS Error:**
   - Origin را در backend درست تنظیم کنید
   - `credentials: false` استفاده کنید

2. **Failed to fetch:**
   - URL backend را بررسی کنید
   - پورت backend باز است؟
   - Firewall تنظیمات؟

3. **401 Unauthorized:**
   - JWT token درست ارسال می‌شود؟
   - Authorization header درست است؟

#### Console Logs:
Frontend در console درخواست‌های API را log می‌کند:
```
Making API request to: https://server.webcodino.ir/api/auth/login
```

### 8. Production Deployment

#### Backend:
1. Environment variables تنظیم کنید
2. JWT_SECRET امن تنظیم کنید
3. Database واقعی استفاده کنید
4. HTTPS فعال کنید

#### Frontend:
1. `NEXT_PUBLIC_API_URL` را به URL تولید تنظیم کنید
2. Build کنید: `npm run build`
3. Deploy کنید

### 9. Security Considerations

- JWT_SECRET قوی استفاده کنید
- Password ها را hash کنید
- Rate limiting اضافه کنید
- Input validation انجام دهید
- HTTPS استفاده کنید
- CORS محدود کنید





