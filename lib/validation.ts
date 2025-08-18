// اعتبارسنجی فرم‌های احراز هویت

export interface ValidationError {
  field: string;
  message: string;
}

// اعتبارسنجی ایمیل
export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'ایمیل الزامی است';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'فرمت ایمیل نامعتبر است';
  }
  
  return null;
};

// اعتبارسنجی شماره تلفن
export const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) {
    return 'شماره تلفن الزامی است';
  }
  
  const phoneRegex = /^(\+98|0)?9\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return 'شماره تلفن معتبر نیست (مثال: 09123456789)';
  }
  
  return null;
};

// اعتبارسنجی کد ملی
export const validateNationalCode = (nationalCode: string): string | null => {
  if (!nationalCode.trim()) {
    return 'کد ملی الزامی است';
  }
  
  if (nationalCode.length !== 10) {
    return 'کد ملی باید 10 رقم باشد';
  }
  
  if (!/^\d{10}$/.test(nationalCode)) {
    return 'کد ملی فقط باید شامل اعداد باشد';
  }
  
  // الگوریتم اعتبارسنجی کد ملی ایران
  const digits = nationalCode.split('').map(Number);
  const checkDigit = digits[9];
  const sum = digits.slice(0, 9).reduce((acc, digit, index) => {
    return acc + (digit * (10 - index));
  }, 0);
  const remainder = sum % 11;
  const calculatedCheckDigit = remainder < 2 ? remainder : 11 - remainder;
  
  if (checkDigit !== calculatedCheckDigit) {
    return 'کد ملی نامعتبر است';
  }
  
  return null;
};

// اعتبارسنجی رمز عبور
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'رمز عبور الزامی است';
  }
  
  if (password.length < 6) {
    return 'رمز عبور باید حداقل 6 کاراکتر باشد';
  }
  
  if (password.length > 50) {
    return 'رمز عبور نمی‌تواند بیشتر از 50 کاراکتر باشد';
  }
  
  // بررسی پیچیدگی رمز عبور (اختیاری)
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return 'رمز عبور باید شامل حروف و اعداد باشد';
  }
  
  return null;
};

// اعتبارسنجی نام
export const validateName = (name: string, fieldName: string = 'نام'): string | null => {
  if (!name.trim()) {
    return `${fieldName} الزامی است`;
  }
  
  if (name.length < 2) {
    return `${fieldName} باید حداقل 2 کاراکتر باشد`;
  }
  
  if (name.length > 50) {
    return `${fieldName} نمی‌تواند بیشتر از 50 کاراکتر باشد`;
  }
  
  // بررسی کاراکترهای مجاز
  const nameRegex = /^[\u0600-\u06FF\s]+$/; // فقط حروف فارسی و فاصله
  if (!nameRegex.test(name)) {
    return `${fieldName} فقط باید شامل حروف فارسی باشد`;
  }
  
  return null;
};

// اعتبارسنجی فرم لاگین
export const validateLoginForm = (data: { identifier: string; password: string }): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!data.identifier.trim()) {
    errors.push({ field: 'identifier', message: 'ایمیل یا شماره تلفن الزامی است' });
  }
  
  if (!data.password) {
    errors.push({ field: 'password', message: 'رمز عبور الزامی است' });
  }
  
  return errors;
};

// اعتبارسنجی فرم ثبت‌نام
export const validateRegisterForm = (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // اعتبارسنجی نام و نام خانوادگی
  const nameError = validateName(data.name, 'نام و نام خانوادگی');
  if (nameError) {
    errors.push({ field: 'name', message: nameError });
  }
  
  // اعتبارسنجی ایمیل
  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.push({ field: 'email', message: emailError });
  }
  
  // اعتبارسنجی شماره تلفن
  const phoneError = validatePhone(data.phone);
  if (phoneError) {
    errors.push({ field: 'phone', message: phoneError });
  }
  
  // اعتبارسنجی رمز عبور
  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.push({ field: 'password', message: passwordError });
  }
  
  // اعتبارسنجی تکرار رمز عبور
  if (data.password !== data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'تکرار رمز عبور با رمز عبور یکسان نیست' });
  }
  
  return errors;
};

// اعتبارسنجی فرم فراموشی رمز عبور
export const validateForgotPasswordForm = (email: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(email);
  if (emailError) {
    errors.push({ field: 'email', message: emailError });
  }
  
  return errors;
};

// تبدیل خطاها به پیام قابل نمایش
export const getFieldError = (errors: ValidationError[], fieldName: string): string | null => {
  const error = errors.find(err => err.field === fieldName);
  return error ? error.message : null;
};
