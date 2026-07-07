import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth.middleware';
import { publicRateLimiter } from '@/middleware/rateLimiter';
import { validate } from '@/middleware/validate.middleware';
import { AuthController } from '@/modules/auth/auth.controller';
import {
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
  resendOtpSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from '@/modules/auth/auth.dto';
import { AuthRepository } from '@/modules/auth/auth.repository';
import { AuthService } from '@/modules/auth/auth.service';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

const repository = new AuthRepository();
const service = new AuthService(repository);
const controller = new AuthController(service);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new passenger
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *     responses:
 *       201: { description: OTP dispatched; registration pending verification }
 *       409: { description: Account already exists }
 *       422: { description: Validation failed }
 */
router.post('/register', publicRateLimiter, validate({ body: registerSchema }), asyncHandler(controller.register));

/**
 * @openapi
 * /auth/verify-otp:
 *   post:
 *     summary: Verify an OTP (registration, login, password reset, mobile change)
 *     tags: [Auth]
 *     responses:
 *       200: { description: OTP verified }
 *       422: { description: Invalid or expired OTP }
 */
router.post(
  '/verify-otp',
  publicRateLimiter,
  validate({ body: verifyOtpSchema }),
  asyncHandler(controller.verifyOtp),
);

/**
 * @openapi
 * /auth/resend-otp:
 *   post:
 *     summary: Resend an OTP (max 3 resends, 60s cooldown)
 *     tags: [Auth]
 *     responses:
 *       200: { description: OTP resent }
 *       409: { description: Maximum resend attempts reached }
 */
router.post(
  '/resend-otp',
  publicRateLimiter,
  validate({ body: resendOtpSchema }),
  asyncHandler(controller.resendOtp),
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login with mobile/email + password
 *     tags: [Auth]
 *     responses:
 *       200: { description: Returns access + refresh tokens }
 *       401: { description: Invalid credentials }
 *       403: { description: Account temporarily locked }
 */
router.post('/login', publicRateLimiter, validate({ body: loginSchema }), asyncHandler(controller.login));

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Rotate refresh token; issue a new access token
 *     tags: [Auth]
 *     responses:
 *       200: { description: New token pair issued }
 *       401: { description: Refresh token invalid or expired }
 */
router.post(
  '/refresh',
  publicRateLimiter,
  validate({ body: refreshTokenSchema }),
  asyncHandler(controller.refresh),
);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Invalidate the current (or all) refresh tokens
 *     tags: [Auth]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Logged out successfully }
 *       401: { description: Missing or invalid access token }
 */
router.post(
  '/logout',
  authMiddleware,
  validate({ body: logoutSchema }),
  asyncHandler(controller.logout),
);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Send a password reset OTP
 *     tags: [Auth]
 *     responses:
 *       200: { description: OTP dispatched if the account exists }
 */
router.post(
  '/forgot-password',
  publicRateLimiter,
  validate({ body: forgotPasswordSchema }),
  asyncHandler(controller.forgotPassword),
);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Set a new password using a verified reset token
 *     tags: [Auth]
 *     responses:
 *       200: { description: Password reset successfully }
 *       401: { description: Reset token invalid or expired }
 */
router.post(
  '/reset-password',
  publicRateLimiter,
  validate({ body: resetPasswordSchema }),
  asyncHandler(controller.resetPassword),
);

export const authRoutes = router;
