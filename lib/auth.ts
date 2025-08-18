// مدیریت توکن و احراز هویت
export interface LoginData {
  identifier: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    lastLogin?: string;
  };
  token?: string;
  message?: string;
}

// ذخیره توکن در localStorage
export const setToken = (token: string, remember: boolean = false) => {
  if (remember) {
    localStorage.setItem('auth_token', token);
  } else {
    sessionStorage.setItem('auth_token', token);
  }
};

// دریافت توکن
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
};

// حذف توکن
export const removeToken = () => {
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
};

// بررسی وجود توکن
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://cw4sok48swgwsc4skokoook4.37.27.187.127.sslip.io/api';

// تابع کمکی برای درخواست‌های API
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'خطا در ارتباط با سرور');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// لاگین
export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
  const raw = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      identifier: loginData.identifier,
      password: loginData.password
    }),
  });
  const token = (raw as any)?.token || (raw as any)?.accessToken || (raw as any)?.updateUser?.accessToken;
  if (token) {
    setToken(token, loginData.remember);
  }
  const userSource = (raw as any)?.user || (raw as any)?.updateUser || (raw as any)?.data;
  const user = userSource
    ? {
        id: userSource._id || userSource.id,
        name: userSource.name,
        email: userSource.email,
        phone: userSource.phone,
        role: userSource.role,
      }
    : undefined;
  return {
    success: !!user,
    user,
    token,
    message: (raw as any)?.message,
  };
};

// ثبت‌نام
export const registerUser = async (registerData: RegisterData): Promise<AuthResponse> => {
  const raw = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password
    }),
  });
  const userSource = raw as any;
  const user = userSource && userSource._id
    ? {
        id: userSource._id || userSource.id,
        name: userSource.name,
        email: userSource.email,
        phone: userSource.phone,
        role: userSource.role,
      }
    : undefined;
  return {
    success: true,
    user,
    message: 'ثبت‌نام با موفقیت انجام شد',
  };
};

// فراموشی رمز عبور
export const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  return await apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

// دریافت اطلاعات کاربر
export const getCurrentUser = async (): Promise<AuthResponse> => {
  const raw = await apiRequest('/auth/me');
  const userSource = (raw as any)?.data || (raw as any)?.user || raw;
  const user = userSource
    ? {
        id: userSource._id || userSource.id,
        name: userSource.name,
        email: userSource.email,
        phone: userSource.phone,
        role: userSource.role,
      }
    : undefined;
  return {
    success: !!user,
    user,
  };
};

// خروج
export const logoutUser = async (): Promise<void> => {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeToken();
  }
};

// Tickets API
export type TicketListItem = {
  _id: string;
  title: string;
  status: string;
  priority: string;
  department: string;
  createdAt: string;
  createdBy?: { name: string; email: string; role: string };
};

export type TicketMessageItem = {
  _id: string;
  message: string;
  createdAt: string;
  sender?: { name: string; role: string };
};

export const fetchTickets = async (): Promise<{ tickets: TicketListItem[] }> => {
  const raw = await apiRequest('/tickets');
  if (Array.isArray(raw)) {
    return { tickets: raw as TicketListItem[] };
  }
  if ((raw as any)?.tickets && Array.isArray((raw as any).tickets)) {
    return { tickets: (raw as any).tickets as TicketListItem[] };
  }
  return { tickets: [] };
};

export const fetchTicketDetail = async (id: string): Promise<{ success: boolean; ticket: TicketListItem; messages: TicketMessageItem[] }> => {
  return await apiRequest(`/tickets/${id}`);
};

export const createTicket = async (payload: { title: string; description?: string; department: string; priority?: string; message: string; attachment?: string | null }) => {
  return await apiRequest('/tickets/add', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const replyTicket = async (payload: { ticketId: string; message: string; attachment?: string | null }) => {
  return await apiRequest('/messages/add', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

// Admin tickets
export const fetchTicketsAdmin = async (): Promise<{ tickets: TicketListItem[] }> => {
  const raw = await apiRequest('/tickets/admin');
  if (Array.isArray(raw)) {
    return { tickets: raw as TicketListItem[] };
  }
  if ((raw as any)?.tickets && Array.isArray((raw as any).tickets)) {
    return { tickets: (raw as any).tickets as TicketListItem[] };
  }
  return { tickets: [] };
};

export const fetchTicketDetailAdmin = async (id: string): Promise<{ ticket: TicketListItem; messages: TicketMessageItem[] }> => {
  return await apiRequest(`/tickets/admin/${id}`);
};

// تغییر رمز عبور
export const changePassword = async (currentPassword: string, newPassword: string): Promise<AuthResponse> => {
  return await apiRequest('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify({
      currentPassword,
      newPassword
    }),
  });
};
