import type { UserRole } from '@/types/domain.types';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        restaurantId?: string;
      };
      requestId?: string;
      rawBody?: string;
    }
  }
}

export {};
