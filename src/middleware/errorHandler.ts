import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { config } from '@/config/index';
import type { FieldError } from '@/types/api.types';
import { AppError } from '@/utils/errors';
import { logger } from '@/utils/logger';
import { errorResponse } from '@/utils/responseFormatter';

interface MongoDuplicateKeyError extends Error {
  code: number;
  keyValue?: Record<string, unknown>;
}

function isDuplicateKeyError(error: unknown): error is MongoDuplicateKeyError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: unknown }).code === 11000
  );
}

/**
 * Global Express error handler (TRD 10.7, 18.1). Must be the last
 * middleware registered in app.ts. Categorizes errors into:
 *  - AppError (operational): formatted into the standard error envelope.
 *  - Mongoose ValidationError: mapped to 422 with field errors.
 *  - Mongoose CastError: mapped to 400 (invalid ObjectId).
 *  - Duplicate key (11000): mapped to 409.
 *  - Anything else (programming error): 500 with a generic message; full
 *    error is logged.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function globalErrorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    if (!error.isOperational) {
      logger.error('Non-operational AppError', {
        requestId: req.requestId,
        message: error.message,
        stack: error.stack,
      });
    }
    errorResponse(res, error.message, error.statusCode, error.errors);
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const errors: FieldError[] = Object.values(error.errors).map((err) => ({
      field: err.path,
      message: err.message,
    }));
    errorResponse(res, 'Validation failed.', 422, errors);
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    errorResponse(res, 'Invalid identifier supplied.', 400);
    return;
  }

  if (isDuplicateKeyError(error)) {
    const field = error.keyValue ? Object.keys(error.keyValue)[0] : 'field';
    errorResponse(res, `${field ?? 'Value'} is already in use.`, 409);
    return;
  }

  const err = error instanceof Error ? error : new Error('Unknown error');
  logger.error('Unhandled error', {
    requestId: req.requestId,
    message: err.message,
    stack: err.stack,
  });

  errorResponse(
    res,
    config.app.nodeEnv === 'production' ? 'Something went wrong. Please try again later.' : err.message,
    500,
  );
}

/**
 * 404 catch-all handler for unmatched routes (TRD 10.1, step 8).
 */
export function notFoundHandler(req: Request, res: Response): void {
  errorResponse(res, `Route ${req.method} ${req.originalUrl} not found.`, 404);
}
