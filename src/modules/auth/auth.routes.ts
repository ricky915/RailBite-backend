import { Router } from 'express';

import { requireAuth } from '@/middleware/auth.middleware';
import { authRateLimiter } from '@/middleware/rateLimiter';
import { validate } from '@/middleware/validate.middleware';

import { authController } from './auth.controller';
import {
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
  resetPasswordSchema,
  sendOtpSchema,
  verifyOtpSchema,
} from './auth.dto';

export const authRoutes = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new passenger account and dispatch a mobile verification OTP (via Twilio Verify)
 *     description: If this mobile number already has an unverified account (a previous registration that never completed OTP verification), this updates that account's name/password and resends the OTP instead of blocking — only a fully mobile-verified account triggers a 409 Conflict.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, mobile, password]
 *             properties:
 *               name: { type: string, minLength: 2, maxLength: 80, example: 'Asha Verma' }
 *               mobile: { type: string, pattern: '^[6-9]\d{9}$', example: '9876543210', description: '10-digit Indian mobile number — the only login identifier' }
 *               password: { type: string, minLength: 8, maxLength: 72, example: 'Passw0rd!', description: 'Must contain at least one letter and one number' }
 *     responses:
 *       '201':
 *         description: Registered — verification OTP sent to the mobile number via Twilio
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/RegisterResponse' }
 *       '409':
 *         description: An already mobile-verified account exists with this number
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       '422': { $ref: '#/components/responses/ValidationError' }
 *       '429': { $ref: '#/components/responses/TooManyRequests' }
 */
authRoutes.post('/register', authRateLimiter, validate({ body: registerSchema }), authController.register);

/**
 * @openapi
 * /auth/send-otp:
 *   post:
 *     summary: Send (or resend) an OTP for a given purpose (via Twilio Verify)
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, purpose]
 *             properties:
 *               identifier: { type: string, example: '9876543210', description: 'Mobile number' }
 *               purpose: { type: string, enum: [REGISTER, LOGIN, FORGOT_PASSWORD, CHANGE_MOBILE, SENSITIVE_ACTION] }
 *     responses:
 *       '200':
 *         description: OTP sent
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OtpSentResponse' }
 *       '422': { $ref: '#/components/responses/ValidationError' }
 *       '429': { $ref: '#/components/responses/TooManyRequests' }
 */
authRoutes.post('/send-otp', authRateLimiter, validate({ body: sendOtpSchema }), authController.sendOtp);

/**
 * @openapi
 * /auth/verify-otp:
 *   post:
 *     summary: Verify an OTP; issues tokens when purpose is REGISTER
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, purpose, code]
 *             properties:
 *               identifier: { type: string, example: '9876543210' }
 *               purpose: { type: string, enum: [REGISTER, LOGIN, FORGOT_PASSWORD, CHANGE_MOBILE, SENSITIVE_ACTION] }
 *               code: { type: string, pattern: '^\d{6}$', example: '123456' }
 *     responses:
 *       '200':
 *         description: OTP verified
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/VerifyOtpResponse' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '422': { $ref: '#/components/responses/ValidationError' }
 *       '429': { $ref: '#/components/responses/TooManyRequests' }
 */
authRoutes.post('/verify-otp', authRateLimiter, validate({ body: verifyOtpSchema }), authController.verifyOtp);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in with mobile number + password
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               identifier: { type: string, example: '9876543210', description: 'Mobile number (field accepts email too, for legacy/admin accounts)' }
 *               password: { type: string, example: 'Passw0rd!' }
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/LoginResponse' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403':
 *         description: Account locked due to repeated failed logins
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       '422': { $ref: '#/components/responses/ValidationError' }
 *       '429': { $ref: '#/components/responses/TooManyRequests' }
 */
authRoutes.post('/login', authRateLimiter, validate({ body: loginSchema }), authController.login);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Rotate a refresh token for a new access/refresh pair
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       '200':
 *         description: Token refreshed
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TokensResponse' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '422': { $ref: '#/components/responses/ValidationError' }
 */
authRoutes.post('/refresh', validate({ body: refreshSchema }), authController.refresh);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Revoke a refresh token
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       '200':
 *         description: Logged out
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/NullDataResponse' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '422': { $ref: '#/components/responses/ValidationError' }
 */
authRoutes.post('/logout', requireAuth, validate({ body: logoutSchema }), authController.logout);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password-reset OTP (sent via Twilio to the registered mobile number)
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier]
 *             properties:
 *               identifier: { type: string, example: '9876543210', description: 'Registered mobile number' }
 *     responses:
 *       '200':
 *         description: If an account exists, an OTP has been sent (response is identical either way to avoid leaking account existence)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OtpSentResponse' }
 *       '422': { $ref: '#/components/responses/ValidationError' }
 *       '429': { $ref: '#/components/responses/TooManyRequests' }
 */
authRoutes.post('/forgot-password', authRateLimiter, validate({ body: forgotPasswordSchema }), authController.forgotPassword);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using a verified OTP (via Twilio Verify)
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, code, newPassword]
 *             properties:
 *               identifier: { type: string, example: '9876543210', description: 'Registered mobile number' }
 *               code: { type: string, pattern: '^\d{6}$', example: '123456' }
 *               newPassword: { type: string, minLength: 8, maxLength: 72, example: 'N3wPassw0rd!' }
 *     responses:
 *       '200':
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/NullDataResponse' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '422': { $ref: '#/components/responses/ValidationError' }
 *       '429': { $ref: '#/components/responses/TooManyRequests' }
 */
authRoutes.post('/reset-password', authRateLimiter, validate({ body: resetPasswordSchema }), authController.resetPassword);
