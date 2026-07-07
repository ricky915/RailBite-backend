import type { Response } from 'express';

import type { FieldError, PaginationMeta } from '@/types/api.types';

/**
 * Sends a success response using the standard envelope (TRD 10.6).
 */
export function successResponse<T>(
  res: Response,
  data: T,
  message = 'Request successful.',
  statusCode = 200,
  meta?: PaginationMeta,
): Response {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
}

/**
 * Sends an error response using the standard envelope (TRD 10.6).
 * Prefer throwing an `AppError` from services; this helper is primarily
 * used directly by the global error handler.
 */
export function errorResponse(
  res: Response,
  message: string,
  statusCode = 500,
  errors?: FieldError[],
): Response {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(errors ? { errors } : {}),
  });
}
