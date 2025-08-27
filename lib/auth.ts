// مدیریت توکن و احراز هویت
type UserSource = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
};

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
  // Clear existing tokens first
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
  
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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://server.webcodino.ir/api';

// تابع کمکی برای درخواست‌های API
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    mode: 'cors', // Enable CORS
    credentials: 'omit', // Don't send cookies to avoid CORS issues
    ...options,
  };

  try {
    console.log(`Making API request to: ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle different response types
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    if (!response.ok) {
      const errorMessage = data?.message || data || `HTTP ${response.status}: ${response.statusText}`;
      
      // اگر خطای احراز هویت باشد، توکن را پاک کن
      if (response.status === 401 || response.status === 403) {
        if (typeof window !== 'undefined') {
          removeToken();
          // اگر در browser هستیم و error authentication است، redirect کن
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
            window.location.href = '/login';
          }
        }
      }
      
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    // Handle specific error types
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.');
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('خطای ناشناخته در ارتباط با سرور');
  }
};

// لاگین
export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    const raw = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier: loginData.identifier,
        password: loginData.password
      }),
    });

    // Extract token from various possible response formats
    const rawDataForToken = raw as Record<string, unknown>;
    const token = rawDataForToken?.token as string || 
                  rawDataForToken?.accessToken as string || 
                  (rawDataForToken?.updateUser as Record<string, unknown>)?.accessToken as string ||
                  (rawDataForToken?.data as Record<string, unknown>)?.token as string ||
                  (rawDataForToken?.user as Record<string, unknown>)?.token as string;

    if (token) {
      setToken(token, loginData.remember);
    }

    // Extract user data from various possible response formats
    const rawDataForLoginUser = raw as Record<string, unknown>;
    const userSource = rawDataForLoginUser?.user as UserSource || 
                       rawDataForLoginUser?.updateUser as UserSource ||
                       (rawDataForLoginUser?.data as Record<string, unknown>)?.user as UserSource || 
                       rawDataForLoginUser?.data as UserSource;

    const user = userSource && typeof userSource === 'object' && userSource !== null
      ? {
          id: userSource._id || userSource.id || '',
          name: userSource.name || '',
          email: userSource.email || '',
          phone: userSource.phone,
          role: userSource.role || 'user',
        }
      : undefined;

    return {
      success: !!user && !!token,
      user,
      token,
      message: (raw as Record<string, unknown>)?.message as string || 'ورود موفقیت‌آمیز بود',
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// ثبت‌نام
export const registerUser = async (registerData: RegisterData): Promise<AuthResponse> => {
  try {
    const raw = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password
      }),
    });

    // Extract user data from various possible response formats
    const rawDataForUser = raw as Record<string, unknown>;
    const userSource = rawDataForUser?.user as UserSource || 
                       (rawDataForUser?.data as Record<string, unknown>)?.user as UserSource || 
                       rawDataForUser?.data as UserSource;

    const user = userSource && typeof userSource === 'object' && userSource !== null
      ? {
          id: userSource._id || userSource.id || '',
          name: userSource.name || '',
          email: userSource.email || '',
          phone: userSource.phone,
          role: userSource.role || 'user',
        }
      : undefined;

    return {
      success: true,
      user,
      message: (raw as Record<string, unknown>)?.message as string || 'ثبت‌نام با موفقیت انجام شد',
    };
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
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
  const userSource = (raw as { data?: unknown; user?: unknown })?.data || (raw as { data?: unknown; user?: unknown })?.user || raw;
  const user = userSource && typeof userSource === 'object' && userSource !== null
    ? {
        id: (userSource as UserSource)._id || (userSource as UserSource).id || '',
        name: (userSource as UserSource).name || '',
        email: (userSource as UserSource).email || '',
        phone: (userSource as UserSource).phone,
        role: (userSource as UserSource).role || '',
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
  createdBy?: { _id?: string; name: string; email: string; role: string };
};

export type TicketMessageItem = {
  _id: string;
  message: string;
  createdAt: string;
  sender?: { _id?: string; name: string; role: string };
};

export const fetchTickets = async (): Promise<{ tickets: TicketListItem[] }> => {
  const raw = await apiRequest('/tickets');
  if (Array.isArray(raw)) {
    return { tickets: raw as TicketListItem[] };
  }
  if ((raw as { tickets?: unknown })?.tickets && Array.isArray((raw as { tickets?: unknown }).tickets)) {
    return { tickets: (raw as { tickets: TicketListItem[] }).tickets };
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

// Update ticket
export const updateTicket = async (ticketId: string, payload: { status?: string; priority?: string; department?: string }) => {
  return await apiRequest(`/tickets/${ticketId}/update`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

// Update message
export const updateMessage = async (messageId: string, payload: { message: string }) => {
  return await apiRequest(`/messages/${messageId}/update`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

// Admin tickets - استفاده از endpoint مخصوص ادمین
export const fetchTicketsAdmin = async (): Promise<{ tickets: TicketListItem[] }> => {
  const raw = await apiRequest('/tickets/support');
  if (Array.isArray(raw)) {
    return { tickets: raw as TicketListItem[] };
  }
  if ((raw as { tickets?: unknown })?.tickets && Array.isArray((raw as { tickets?: unknown }).tickets)) {
    return { tickets: (raw as { tickets: TicketListItem[] }).tickets };
  }
  return { tickets: [] };
};

export const fetchTicketDetailAdmin = async (id: string): Promise<{ ticket: TicketListItem; messages: TicketMessageItem[] }> => {
  const response = await apiRequest(`/tickets/${id}`);
  
  // Handle different response formats
  const responseData = response as Record<string, unknown>;
  const ticket = responseData.ticket || (responseData.data as Record<string, unknown>)?.ticket || responseData;
  const messages = responseData.messages || (responseData.data as Record<string, unknown>)?.messages || 
                   (ticket as Record<string, unknown>)?.messages || [];
  
  return {
    ticket: ticket as TicketListItem,
    messages: Array.isArray(messages) ? messages : []
  };
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

// Users API for admin
export type UserItem = {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// Get all users (admin)
export const fetchUsersAdmin = async (): Promise<{ users: UserItem[] }> => {
  const raw = await apiRequest('/users');
  if (Array.isArray(raw)) {
    return { users: raw as UserItem[] };
  }
  if ((raw as { users?: unknown })?.users && Array.isArray((raw as { users?: unknown }).users)) {
    return { users: (raw as { users: UserItem[] }).users };
  }
  return { users: [] };
};

// Get user by ID (admin)
export const fetchUserById = async (userId: string): Promise<{ user: UserItem }> => {
  return await apiRequest(`/users/${userId}`);
};
