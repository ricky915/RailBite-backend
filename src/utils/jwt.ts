import jwt from 'jsonwebtoken';

import { config } from '@/config/index';
import type { UserRole } from '@/types/domain.types';

export interface AccessTokenPayload {
  userId: string;
  role: UserRole;
  restaurantId?: string;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
  tokenId: string;
}

export interface ResetTokenPayload {
  userId: string;
  purpose: 'password_reset';
}

const RESET_TOKEN_EXPIRY = '15m';

/**
 * Signs a 1-hour access token (TRD 13.3).
 */
export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiry,
  } as jwt.SignOptions);
}

/**
 * Signs a 7-day refresh token (TRD 13.3).
 */
export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry,
  } as jwt.SignOptions);
}

/**
 * Verifies and decodes an access token. Throws `JsonWebTokenError` /
 * `TokenExpiredError` on failure — callers (auth.middleware.ts) translate
 * these into `AuthenticationError`.
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, config.jwt.accessSecret) as AccessTokenPayload;
}

/**
 * Verifies and decodes a refresh token.
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, config.jwt.refreshSecret) as RefreshTokenPayload;
}

/**
 * Signs a short-lived (15 min) password reset token, issued after OTP
 * verification during the forgot-password flow (TRD 13.4).
 */
export function signResetToken(payload: ResetTokenPayload): string {
  return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: RESET_TOKEN_EXPIRY });
}

/**
 * Verifies and decodes a password reset token.
 */
export function verifyResetToken(token: string): ResetTokenPayload {
  return jwt.verify(token, config.jwt.accessSecret) as ResetTokenPayload;
}
