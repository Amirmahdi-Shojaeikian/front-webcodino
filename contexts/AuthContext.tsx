"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, removeToken, isAuthenticated, getCurrentUser, AuthResponse } from '@/lib/auth';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface AuthContextType {
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthResponse['user']) => void;
  logout: () => void;
  updateUser: (user: AuthResponse['user']) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
  removeToast: (id: string) => void;
  toasts: ToastMessage[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // بررسی وضعیت احراز هویت در لود اولیه
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          const result = await getCurrentUser();
          if (result.success && result.user) {
            setUser(result.user);
          } else {
            // توکن نامعتبر است
            removeToken();
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: AuthResponse['user']) => {
    setUser(userData);
    // نمایش پیام خوش‌آمدگویی
    showToast(`خوش آمدید ${userData.name}! 🎉`, 'success', 4000);
  };

  const logout = () => {
    setUser(null);
    removeToken();
    showToast('شما با موفقیت خارج شدید', 'info', 3000);
  };

  const updateUser = (userData: AuthResponse['user']) => {
    setUser(userData);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success', duration: number = 3000) => {
    const id = Date.now().toString();
    const newToast: ToastMessage = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    showToast,
    removeToast,
    toasts,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


