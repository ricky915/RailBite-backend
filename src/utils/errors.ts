import type { FieldError } from '@/types/api.types';

/**
 * Base application error. Services throw `AppError` (or one of its
 * subclasses below) instead of generic `Error` so the global error handler
 * can format a consistent error envelope (TRD 10.7).
 *
 * `isOperational` distinguishes expected, handled failures (bad input,
 * missing resource, business rule violation) from unexpected programming
 * errors. Only operational errors are safe to surface to the client as-is.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: FieldError[];

  constructor(message: string, statusCode = 500, isOperational = true, errors?: FieldError[]) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed.', errors?: FieldError[]) {
    super(message, 422, true, errors);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required.') {
    super(message, 401, true);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'You do not have permission to perform this action.') {
    super(message, 403, true);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found.') {
    super(message, 404, true);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists.') {
    super(message, 409, true);
  }
}

export class PaymentError extends AppError {
  constructor(message = 'Payment could not be processed.') {
    super(message, 402, true);
  }
}

export class ExternalServiceError extends AppError {
  constructor(message = 'An external service is currently unavailable.') {
    super(message, 502, true);
  }
}

/**
 * Thrown by scaffolded module methods that are intentionally not yet
 * implemented. Returns HTTP 501 (Not Implemented).
 */
export class NotImplementedError extends AppError {
  constructor(message = 'This feature is not yet implemented.') {
    super(message, 501, true);
  }
}
