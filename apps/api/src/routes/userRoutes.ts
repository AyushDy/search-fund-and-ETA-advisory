import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth } from '../middleware/auth';
import { sendSuccess } from '../utils/response';
import { notificationPreferencesSchema, passwordChangeSchema, profileUpdateSchema } from '../validators/auth';
import * as authService from '../services/authService';

const router = Router();

router.use(requireAuth);

router.get('/me', asyncHandler(async (request, response) => {
  const user = await authService.getCurrentUser(request.user!.id);
  sendSuccess(response, { user });
}));

router.patch('/me', asyncHandler(async (request, response) => {
  const input = profileUpdateSchema.parse(request.body);
  const user = await authService.updateProfile(request.user!.id, input);
  sendSuccess(response, { user }, 'Profile updated');
}));

router.post('/me/password', asyncHandler(async (request, response) => {
  const input = passwordChangeSchema.parse(request.body);
  const user = await authService.changePassword(request.user!.id, input);
  sendSuccess(response, { user }, 'Password changed; existing sessions were revoked');
}));

router.get('/me/preferences', asyncHandler(async (request, response) => {
  const user = await authService.getCurrentUser(request.user!.id);
  sendSuccess(response, { preferences: user.notificationPreferences });
}));

router.patch('/me/preferences', asyncHandler(async (request, response) => {
  const input = notificationPreferencesSchema.parse(request.body);
  const user = await authService.updateNotificationPreferences(request.user!.id, input);
  sendSuccess(response, { preferences: user.notificationPreferences }, 'Preferences updated');
}));

export default router;