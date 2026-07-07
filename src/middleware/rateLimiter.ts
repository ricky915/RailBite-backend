import rateLimit from 'express-rate-limit';

import { config } from '@/config/index';

/**
 * Public rate limiter: 100 req/min per IP (TRD 10.5, 19).
 */
export const publicRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxPublic,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests. Please try again shortly.',
  },
});

/**
 * Authenticated rate limiter: 500 req/min per IP (TRD 10.5, 19).
 * Keyed on the authenticated user id when available, falling back to IP.
 */
export const authenticatedRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxAuthenticated,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.userId ?? req.ip ?? 'unknown',
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests. Please try again shortly.',
  },
});
