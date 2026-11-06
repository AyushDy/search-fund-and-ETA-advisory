import argon2 from 'argon2';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { getConfig } from '../config/env';
import { Session } from '../models/Session';
import { EmailToken, type EmailTokenType } from '../models/EmailToken';
import { User, toSafeUser, type UserDocument } from '../models/User';
import { AppError } from '../utils/errors';
import { sendPasswordResetEmail, sendVerificationEmail } from './emailService';

const refreshLifetimeMs = 7 * 24 * 60 * 60 * 1000;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function issueEmailToken(userId: UserDocument['_id'], type: EmailTokenType, lifetimeMs: number): Promise<string> {
  await EmailToken.updateMany({ userId, type, usedAt: { $exists: false } }, { $set: { usedAt: new Date() } });
  const token = crypto.randomBytes(48).toString('base64url');
  await EmailToken.create({ userId, type, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + lifetimeMs) });
  return token;
}

function issueAccessToken(user: UserDocument): string {
  return jwt.sign({ sub: String(user._id) }, getConfig().JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

export async function register(input: { firstName: string; lastName: string; email: string; password: string; role?: 'INVESTOR' | 'STAFF' | 'APPROVER' | 'ADMIN' }) {
  const email = normalizeEmail(input.email);
  const existing = await User.findOne({ email });
  if (existing) throw new AppError(409, 'An account with that email already exists', 'EMAIL_IN_USE');
  const role = getConfig().ALLOW_PUBLIC_INTERNAL_ROLES ? (input.role ?? 'INVESTOR') : 'INVESTOR';
  const user = await User.create({ firstName: input.firstName.trim(), lastName: input.lastName.trim(), email, passwordHash: await argon2.hash(input.password, { type: argon2.argon2id }), role });
  try { const token = await issueEmailToken(user._id, 'VERIFY_EMAIL', 24 * 60 * 60 * 1000); await sendVerificationEmail(user.email, token); } catch (error) { console.error('Verification email could not be sent', error); }
  return toSafeUser(user);
}

export async function createInternalAccount(input: { firstName: string; lastName: string; email: string; password: string; role: 'STAFF' | 'APPROVER' | 'ADMIN' }) {
  const email = normalizeEmail(input.email);
  const existing = await User.findOne({ email });
  if (existing) throw new AppError(409, 'An account with that email already exists', 'EMAIL_IN_USE');
  const user = await User.create({ firstName: input.firstName.trim(), lastName: input.lastName.trim(), email, passwordHash: await argon2.hash(input.password, { type: argon2.argon2id }), role: input.role });
  return toSafeUser(user);
}

export async function authenticate(input: { email: string; password: string }) {
  const user = await User.findOne({ email: normalizeEmail(input.email) }).select('+passwordHash');
  if (!user || !(await argon2.verify(user.passwordHash, input.password)) || user.status !== 'ACTIVE') {
    throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }
  user.lastLoginAt = new Date();
  await user.save();
  return createSession(user);
}

export async function createSession(user: UserDocument) {
  const refreshToken = crypto.randomBytes(48).toString('base64url');
  await Session.create({ userId: user._id, refreshTokenHash: hashToken(refreshToken), expiresAt: new Date(Date.now() + refreshLifetimeMs) });
  return { user: toSafeUser(user), accessToken: issueAccessToken(user), refreshToken };
}

export async function refresh(refreshToken: string) {
  const session = await Session.findOne({ refreshTokenHash: hashToken(refreshToken), revokedAt: { $exists: false }, expiresAt: { $gt: new Date() } }).select('+refreshTokenHash');
  if (!session) throw new AppError(401, 'Refresh session is invalid or expired', 'INVALID_SESSION');
  const user = await User.findById(session.userId).select('+passwordHash');
  if (!user || user.status !== 'ACTIVE') throw new AppError(401, 'Refresh session is invalid or expired', 'INVALID_SESSION');
  session.revokedAt = new Date();
  await session.save();
  return createSession(user);
}

export async function revoke(refreshToken: string | undefined): Promise<void> {
  if (refreshToken) await Session.updateOne({ refreshTokenHash: hashToken(refreshToken), revokedAt: { $exists: false } }, { $set: { revokedAt: new Date() } });
}

export async function getCurrentUser(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User account was not found', 'USER_NOT_FOUND');
  return toSafeUser(user);
}

export async function updateProfile(userId: string, input: { firstName?: string; lastName?: string; phone?: string | null }) {
  const user = await User.findByIdAndUpdate(userId, { $set: input }, { new: true, runValidators: true });
  if (!user) throw new AppError(404, 'User account was not found', 'USER_NOT_FOUND');
  return toSafeUser(user);
}

export async function changePassword(userId: string, input: { currentPassword: string; newPassword: string }) {
  const user = await User.findById(userId).select('+passwordHash');
  if (!user || !(await argon2.verify(user.passwordHash, input.currentPassword))) {
    throw new AppError(401, 'Current password is incorrect', 'INVALID_CURRENT_PASSWORD');
  }
  user.passwordHash = await argon2.hash(input.newPassword, { type: argon2.argon2id });
  await user.save();
  await Session.updateMany({ userId, revokedAt: { $exists: false } }, { $set: { revokedAt: new Date() } });
  return toSafeUser(user);
}

export async function verifyEmail(token: string) {
  const record = await EmailToken.findOne({ tokenHash: hashToken(token), type: 'VERIFY_EMAIL', usedAt: { $exists: false }, expiresAt: { $gt: new Date() } }).select('+tokenHash');
  if (!record) throw new AppError(400, 'Verification token is invalid or expired', 'INVALID_TOKEN');
  const user = await User.findById(record.userId);
  if (!user) throw new AppError(400, 'Verification token is invalid or expired', 'INVALID_TOKEN');
  user.emailVerified = true; await user.save(); record.usedAt = new Date(); await record.save(); return toSafeUser(user);
}

export async function resendVerification(email: string): Promise<void> {
  const user = await User.findOne({ email: normalizeEmail(email) });
  if (!user || user.emailVerified) return;
  try { const token = await issueEmailToken(user._id, 'VERIFY_EMAIL', 24 * 60 * 60 * 1000); await sendVerificationEmail(user.email, token); } catch (error) { console.error('Verification email could not be sent', error); }
}

export async function requestPasswordReset(email: string): Promise<void> {
  const user = await User.findOne({ email: normalizeEmail(email) });
  if (!user) return;
  try { const token = await issueEmailToken(user._id, 'RESET_PASSWORD', 60 * 60 * 1000); await sendPasswordResetEmail(user.email, token); } catch (error) { console.error('Password reset email could not be sent', error); }
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const record = await EmailToken.findOne({ tokenHash: hashToken(token), type: 'RESET_PASSWORD', usedAt: { $exists: false }, expiresAt: { $gt: new Date() } }).select('+tokenHash');
  if (!record) throw new AppError(400, 'Reset token is invalid or expired', 'INVALID_TOKEN');
  const user = await User.findById(record.userId).select('+passwordHash');
  if (!user) throw new AppError(400, 'Reset token is invalid or expired', 'INVALID_TOKEN');
  user.passwordHash = await argon2.hash(newPassword, { type: argon2.argon2id }); await user.save(); record.usedAt = new Date(); await record.save(); await Session.updateMany({ userId: user._id, revokedAt: { $exists: false } }, { $set: { revokedAt: new Date() } });
}

export async function updateNotificationPreferences(userId: string, input: { email?: boolean; inApp?: boolean }) {
  const update: Record<string, boolean> = {};
  if (input.email !== undefined) update['notificationPreferences.email'] = input.email;
  if (input.inApp !== undefined) update['notificationPreferences.inApp'] = input.inApp;
  const user = await User.findByIdAndUpdate(userId, { $set: update }, { new: true, runValidators: true });
  if (!user) throw new AppError(404, 'User account was not found', 'USER_NOT_FOUND');
  return toSafeUser(user);
}

export { normalizeEmail };
