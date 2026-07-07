import type { UserRole } from '@/types/domain.types';

/**
 * JWT access token payload attached to `req.user` by auth.middleware.ts
 * after successful verification (TRD 13.3).
 */
export interface AuthenticatedUser {
  userId: string;
  role: UserRole;
  restaurantId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      requestId?: string;
    }
  }
}

export {};
