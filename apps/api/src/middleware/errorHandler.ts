import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { isAppError } from '../utils/errors';
import { sendError } from '../utils/response';

export const notFoundHandler: RequestHandler = (request, response) => {
  sendError(response, `Route ${request.method} ${request.path} was not found`, 'NOT_FOUND', 404);
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    sendError(response, 'Request validation failed', 'VALIDATION_ERROR', 400, error.flatten().fieldErrors);
    return;
  }
  if (isAppError(error)) {
    sendError(response, error.message, error.code, error.statusCode);
    return;
  }
  const duplicate = error as { code?: number };
  if (duplicate.code === 11000) {
    sendError(response, 'A record with that unique value already exists', 'CONFLICT', 409);
    return;
  }
  console.error(error);
  sendError(response, 'An unexpected error occurred', 'INTERNAL_ERROR', 500);
};
