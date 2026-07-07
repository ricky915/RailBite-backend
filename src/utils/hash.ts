import bcrypt from 'bcrypt';

import { config } from '@/config/index';

/**
 * Hashes a plaintext password using bcrypt at the configured cost factor
 * (default 12, per TRD 13.1 / 19).
 */
export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, config.bcrypt.saltRounds);
}

/**
 * Compares a plaintext password against a stored bcrypt hash.
 */
export async function comparePassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

/**
 * Hashes an opaque token (refresh token, OTP, reset token) with bcrypt so
 * that only the hash is persisted (TRD 12.1 refreshTokens/otps collections).
 */
export async function hashToken(token: string): Promise<string> {
  return bcrypt.hash(token, config.bcrypt.saltRounds);
}

/**
 * Compares a plaintext token against a stored bcrypt hash.
 */
export async function compareToken(token: string, hash: string): Promise<boolean> {
  return bcrypt.compare(token, hash);
}
