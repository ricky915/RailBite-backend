import type { NextFunction, Request, Response } from 'express';

import type { UserRole } from '@/types/domain.types';
import { AuthenticationError, AuthorizationError } from '@/utils/errors';

/**
 * Role-guard factory (TRD 14.1). Usage:
 *   router.patch('/admin/restaurants/:id/approve',
 *     authMiddleware, requireRole(['admin', 'super_admin']),
 *     validate(dto), controller.approve);
 *
 * Must run after `authMiddleware` so `req.user` is populated.
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AuthenticationError('Please log in to continue.');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AuthorizationError('You do not have permission to perform this action.');
    }

    next();
  };
}
