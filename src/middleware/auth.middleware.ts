import type { NextFunction, Request, Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';

import { AuthenticationError } from '@/utils/errors';
import { verifyAccessToken } from '@/utils/jwt';

/**
 * Verifies the JWT access token from the `Authorization: Bearer <token>`
 * header and attaches the decoded payload to `req.user` (TRD 10.5, 13.3).
 * Applied to all protected routes.
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new AuthenticationError('Please log in to continue.');
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      userId: payload.userId,
      role: payload.role,
      restaurantId: payload.restaurantId,
    };
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AuthenticationError('Your session has expired. Please log in again.');
    }
    throw new AuthenticationError('Invalid authentication token.');
  }
}
