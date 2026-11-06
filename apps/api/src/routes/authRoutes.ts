import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { requireAuth, requireRoles } from '../middleware/auth';
import { emailTokenSchema, forgotPasswordSchema, internalAccountSchema, loginSchema, notificationPreferencesSchema, passwordChangeSchema, profileUpdateSchema, registerSchema, resetPasswordSchema } from '../validators/auth';
import * as authService from '../services/authService';

const router = Router();
const cookieOptions = () => {
  const production = process.env.NODE_ENV === 'production';
  const secure = production || process.env.COOKIE_SECURE === 'true';
  return { httpOnly: true, secure, sameSite: secure ? 'none' as const : 'lax' as const };
};

router.post('/register', asyncHandler(async (request, response) => {
  const input = registerSchema.parse(request.body);
  const user = await authService.register(input);
  sendSuccess(response, { user }, 'Investor account created', 201);
}));

router.post('/login', asyncHandler(async (request, response) => {
  const input = loginSchema.parse(request.body);
  const result = await authService.authenticate(input);
  response.cookie('accessToken', result.accessToken, { ...cookieOptions(), maxAge: 15 * 60 * 1000, path: '/' });
  response.cookie('refreshToken', result.refreshToken, { ...cookieOptions(), maxAge: 7 * 24 * 60 * 60 * 1000, path: '/auth' });
  sendSuccess(response, { user: result.user }, 'Signed in');
}));

router.post('/refresh', asyncHandler(async (request, response) => {
  const token = request.cookies?.refreshToken;
  if (!token) { response.status(401).json({ success: false, message: 'Authentication is required', error: { code: 'UNAUTHENTICATED' } }); return; }
  const result = await authService.refresh(token);
  response.cookie('accessToken', result.accessToken, { ...cookieOptions(), maxAge: 15 * 60 * 1000, path: '/' });
  response.cookie('refreshToken', result.refreshToken, { ...cookieOptions(), maxAge: 7 * 24 * 60 * 60 * 1000, path: '/auth' });
  sendSuccess(response, { user: result.user }, 'Session refreshed');
}));

router.post('/logout', asyncHandler(async (request, response) => {
  await authService.revoke(request.cookies?.refreshToken);
  response.clearCookie('accessToken', { ...cookieOptions(), path: '/' });
  response.clearCookie('refreshToken', { ...cookieOptions(), path: '/auth' });
  sendSuccess(response, null, 'Signed out');
}));

router.get('/me', requireAuth, asyncHandler(async (request, response) => {
  const user = await authService.getCurrentUser(request.user!.id);
  sendSuccess(response, { user });
}));

router.post('/internal-accounts', requireAuth, requireRoles('ADMIN'), asyncHandler(async (request, response) => {
  const input = internalAccountSchema.parse(request.body);
  const user = await authService.createInternalAccount(input);
  sendSuccess(response, { user }, 'Internal account created', 201);
}));

router.post('/verify-email', asyncHandler(async (request, response) => {
  const { token } = emailTokenSchema.parse(request.body);
  const user = await authService.verifyEmail(token);
  sendSuccess(response, { user }, 'Email verified');
}));

router.post('/resend-verification', asyncHandler(async (request, response) => {
  const { email } = forgotPasswordSchema.parse(request.body);
  await authService.resendVerification(email);
  sendSuccess(response, null, 'If the account exists and needs verification, an email will be sent');
}));

router.post('/forgot-password', asyncHandler(async (request, response) => {
  const { email } = forgotPasswordSchema.parse(request.body);
  await authService.requestPasswordReset(email);
  sendSuccess(response, null, 'If the account exists, a password reset email will be sent');
}));

router.post('/reset-password', asyncHandler(async (request, response) => {
  const { token, newPassword } = resetPasswordSchema.parse(request.body);
  await authService.resetPassword(token, newPassword);
  sendSuccess(response, null, 'Password reset successfully');
}));

export default router;
