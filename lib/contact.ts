export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
};

type ContactResponse = {
  success: boolean;
  message?: string;
  data?: unknown;
  errors?: string[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://server.webcodino.ir/api';

export const submitContact = async (payload: ContactPayload): Promise<ContactResponse> => {
  const response = await fetch(`${API_BASE_URL}/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data: ContactResponse = await response.json();

  if (!response.ok) {
    const message = (data && (data.errors?.[0] || data.message)) || 'خطا در ارسال پیام تماس';
    throw new Error(message);
  }

  return data;
};

// Admin-side helpers
import { getToken } from './auth';

export type ContactItem = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
  status: 'new' | 'answered';
  createdAt: string;
};

const adminRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
  const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || 'خطا در ارتباط با سرور');
  }
  return data;
};

export const fetchContactsAdmin = async (params?: { page?: number; limit?: number; status?: 'new' | 'answered' }) => {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.status) qs.set('status', params.status);
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return await adminRequest(`/contacts${query}`) as { success: boolean; data: ContactItem[]; pagination?: { page: number; limit: number; total: number; totalPages: number } };
};

export const fetchContactByIdAdmin = async (id: string) => {
  return await adminRequest(`/contacts/${id}`) as { success: boolean; data: ContactItem };
};

export const updateContactStatusAdmin = async (id: string, status: 'new' | 'answered') => {
  return await adminRequest(`/contacts/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }) as { success: boolean; message: string; data: ContactItem };
};

// Delete contact
export const deleteContact = async (contactId: string) => {
  return await adminRequest(`/contacts/${contactId}`, {
    method: 'DELETE',
  }) as { success: boolean; message: string };
};

// Get contact stats
export const getContactStats = async () => {
  return await adminRequest('/contacts/stats') as { 
    success: boolean; 
    data: { new: number; answered: number; total: number } 
  };
};

export const deleteContactAdmin = async (id: string) => {
  return await adminRequest(`/contacts/${id}`, { method: 'DELETE' }) as { success: boolean; message: string };
};

export const getContactStatsAdmin = async () => {
  return await adminRequest(`/contacts/stats`) as { success: boolean; data: { total: number; new: number; answered: number } };
};


