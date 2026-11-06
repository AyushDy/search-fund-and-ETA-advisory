import { z } from 'zod';

const password = z.string().min(12, 'Password must be at least 12 characters').max(128, 'Password is too long');
const phone = z.string().trim().min(7).max(32).regex(/^[+0-9().\-\s]+$/, 'Phone number is invalid');
export const registerSchema = z.object({ firstName: z.string().trim().min(1).max(80), lastName: z.string().trim().min(1).max(80), email: z.string().email().max(254), password, role: z.enum(['INVESTOR', 'STAFF', 'APPROVER', 'ADMIN']).optional() });
export const loginSchema = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(128) });
export const internalAccountSchema = z.object({ firstName: z.string().trim().min(1).max(80), lastName: z.string().trim().min(1).max(80), email: z.string().email().max(254), password, role: z.enum(['STAFF', 'APPROVER', 'ADMIN']) });
export const profileUpdateSchema = z.object({ firstName: z.string().trim().min(1).max(80).optional(), lastName: z.string().trim().min(1).max(80).optional(), phone: phone.nullable().optional() }).strict().refine((value) => Object.keys(value).length > 0, 'At least one profile field is required');
export const passwordChangeSchema = z.object({ currentPassword: z.string().min(1).max(128), newPassword: password }).refine((value) => value.currentPassword !== value.newPassword, { path: ['newPassword'], message: 'New password must be different from the current password' });
export const notificationPreferencesSchema = z.object({ email: z.boolean().optional(), inApp: z.boolean().optional() }).strict().refine((value) => Object.keys(value).length > 0, 'At least one preference is required');
export const emailTokenSchema = z.object({ token: z.string().min(20).max(200) });
export const forgotPasswordSchema = z.object({ email: z.string().email().max(254) });
export const resetPasswordSchema = z.object({ token: z.string().min(20).max(200), newPassword: password });
