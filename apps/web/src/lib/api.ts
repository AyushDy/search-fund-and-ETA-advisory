import type { ApiResponse, BusinessListing, Enquiry, SavedBusiness, User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { ...init, credentials: 'include', headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
  const body = await response.json() as ApiResponse<T> & { error?: { details?: Record<string, string[]> } };
  if (!response.ok) throw new Error(body.message || 'The request could not be completed');
  return body.data;
}

export const api = {
  me: () => request<{ user: User }>('/auth/me'),
  updateProfile: (input: { firstName?: string; lastName?: string; phone?: string | null }) => request<{ user: User }>('/users/me', { method: 'PATCH', body: JSON.stringify(input) }),
  changePassword: (input: { currentPassword: string; newPassword: string }) => request<{ user: User }>('/users/me/password', { method: 'POST', body: JSON.stringify(input) }),
  preferences: () => request<{ preferences: User['notificationPreferences'] }>('/users/me/preferences'),
  updatePreferences: (input: Partial<User['notificationPreferences']>) => request<{ preferences: User['notificationPreferences'] }>('/users/me/preferences', { method: 'PATCH', body: JSON.stringify(input) }),
  login: (input: { email: string; password: string }) => request<{ user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(input) }),
  register: (input: { firstName: string; lastName: string; email: string; password: string; role?: 'INVESTOR' | 'STAFF' | 'APPROVER' | 'ADMIN' }) => request<{ user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(input) }),
  createInternalAccount: (input: { firstName: string; lastName: string; email: string; password: string; role: 'STAFF' | 'APPROVER' | 'ADMIN' }) => request<{ user: User }>('/auth/internal-accounts', { method: 'POST', body: JSON.stringify(input) }),
  logout: () => request<null>('/auth/logout', { method: 'POST' }),
  verifyEmail: (token: string) => request<{ user: User }>('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) }),
  resendVerification: (email: string) => request<null>('/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email }) }),
  forgotPassword: (email: string) => request<null>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token: string, newPassword: string) => request<null>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) }),
  listings: (query = '') => request<{ listings: BusinessListing[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } }>(`/listings${query}`),
  listing: (id: string) => request<{ listing: BusinessListing }>(`/listings/${id}`),
  createListing: (input: Record<string, unknown>) => request<{ listing: BusinessListing }>('/listings', { method: 'POST', body: JSON.stringify(input) }),
  businesses: (query: string) => request<{ listings: BusinessListing[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } }>(`/businesses${query}`),
  business: (id: string) => request<{ listing: BusinessListing }>(`/businesses/${id}`),
  savedBusinesses: () => request<{ savedBusinesses: SavedBusiness[] }>('/saved-businesses'),
  saveBusiness: (listingId: string) => request<{ savedBusiness: SavedBusiness }>('/saved-businesses', { method: 'POST', body: JSON.stringify({ listingId }) }),
  removeSavedBusiness: (listingId: string) => request<{ listingId: string }>(`/saved-businesses/${listingId}`, { method: 'DELETE' }),
  enquiries: () => request<{ enquiries: Enquiry[] }>('/enquiries'),
  createEnquiry: (input: { listingId: string; message?: string; budget?: number; experience?: string; reason?: string }) => request<{ enquiry: Enquiry }>('/enquiries', { method: 'POST', body: JSON.stringify(input) }),
  internalEnquiries: () => request<{ enquiries: Enquiry[] }>('/internal/enquiries'),
  internalEnquiry: (id: string) => request<{ enquiry: Enquiry }>(`/internal/enquiries/${id}`),
  updateEnquiryStatus: (id: string, status: Enquiry['status']) => request<{ enquiry: Enquiry }>(`/internal/enquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  assignEnquiry: (id: string, assignedTo: string | null) => request<{ enquiry: Enquiry }>(`/internal/enquiries/${id}/assignment`, { method: 'PATCH', body: JSON.stringify({ assignedTo }) }),
  updateEnquiryNote: (id: string, internalNote: string) => request<{ enquiry: Enquiry }>(`/internal/enquiries/${id}/internal-note`, { method: 'PATCH', body: JSON.stringify({ internalNote }) }),
  updateContactDecision: (id: string, contactDecision: string) => request<{ enquiry: Enquiry }>(`/internal/enquiries/${id}/contact-decision`, { method: 'PATCH', body: JSON.stringify({ contactDecision }) }),
  updateFollowUp: (id: string, input: { followUpAt?: string | null; followUpNote?: string | null }) => request<{ enquiry: Enquiry }>(`/internal/enquiries/${id}/follow-up`, { method: 'PATCH', body: JSON.stringify(input) })
};
