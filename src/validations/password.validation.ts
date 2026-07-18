import { z } from 'zod';

/**
 * Shared by registration and password-change flows — keep the rule set in one place.
 * No complexity rules by design — users can set any password they want. The 72-char
 * cap is a bcrypt hashing limit (bytes beyond it are silently truncated), not a policy choice.
 */
export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .max(72, 'Password must be at most 72 characters');
