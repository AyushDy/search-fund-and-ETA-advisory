import type { Response } from 'express';

export function sendSuccess<T>(response: Response, data: T, message = 'Request completed successfully', statusCode = 200): void {
  response.status(statusCode).json({ success: true, message, data });
}

export function sendError(response: Response, message: string, code: string, statusCode: number, details?: unknown): void {
  response.status(statusCode).json({ success: false, message, error: { code, ...(details ? { details } : {}) } });
}
