import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { getConfig } from '../config/env';
import { User } from '../models/User';
import type { Role } from '../types/auth';
import { AppError } from '../utils/errors';

export const requireAuth: RequestHandler = async (request, _response, next) => {
  try {
    const token = request.cookies?.accessToken ?? request.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) throw new AppError(401, 'Authentication is required', 'UNAUTHENTICATED');
    const payload = jwt.verify(token, getConfig().JWT_ACCESS_SECRET) as { sub?: string };
    if (!payload.sub) throw new AppError(401, 'Authentication is required', 'UNAUTHENTICATED');
    const user = await User.findById(payload.sub).select('+passwordHash');
    if (!user || user.status !== 'ACTIVE') throw new AppError(401, 'Authentication is required', 'UNAUTHENTICATED');
    request.user = { id: user.id, role: user.role, status: user.status, email: user.email };
    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError(401, 'Authentication is required', 'UNAUTHENTICATED'));
  }
};

export function requireRoles(...allowedRoles: Role[]): RequestHandler {
  return (request, _response, next) => {
    if (!request.user) {
      next(new AppError(401, 'Authentication is required', 'UNAUTHENTICATED'));
      return;
    }
    if (!allowedRoles.includes(request.user.role)) {
      next(new AppError(403, 'You do not have permission to perform this action', 'FORBIDDEN'));
      return;
    }
    next();
  };
}
