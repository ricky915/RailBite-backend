import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { ZodError } from 'zod';

import type { FieldError } from '@/types/api.types';
import { ValidationError } from '@/utils/errors';

export interface ValidationSchemas {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
}

function toFieldErrors(error: ZodError): FieldError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || '(root)',
    message: issue.message,
  }));
}

/**
 * Runs Zod schema parsing on `req.body` / `req.params` / `req.query`
 * (TRD 10.5, 17.3). On failure, throws a `ValidationError` (422) with a
 * field-level errors array. On success, the parsed (and coerced) values
 * replace the raw request values so downstream code works with safely
 * typed data.
 */
export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        // Express 4 typings expose `query` as read-only in some setups;
        // reassigning the object in place keeps compatibility.
        const parsedQuery = schemas.query.parse(req.query) as Record<string, unknown>;
        Object.assign(req.query, parsedQuery);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError('Validation failed.', toFieldErrors(error));
      }
      throw error;
    }
  };
}
