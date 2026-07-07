import { z } from 'zod';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/config/constants';

/**
 * Shared Zod validation primitives (TRD 17.4). Feature-specific DTOs
 * compose these instead of redefining regexes/rules inline.
 */

export const indianMobile = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number.');

export const email = z
  .string()
  .email('Please enter a valid email address.')
  .max(100, 'Email must not exceed 100 characters.')
  .toLowerCase();

export const password = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .regex(/\d/, 'Password must contain at least one digit.')
  .regex(/[^\w]/, 'Password must contain at least one special character.');

export const mongoId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid identifier.');

export const pnr = z.string().regex(/^\d{10}$/, 'PNR must be exactly 10 digits.');

export const trainNumber = z.string().regex(/^\d{5}$/, 'Train number must be exactly 5 digits.');

export const coachNumber = z
  .string()
  .regex(/^[A-Za-z0-9]{1,4}$/, 'Coach must be 1-4 alphanumeric characters.');

export const seatNumber = z.string().regex(/^\d{1,3}$/, 'Seat must be 1-3 numeric digits.');

export const inrAmount = z.number().positive().multipleOf(0.01);

export const name = z
  .string()
  .min(2, 'Name must be at least 2 characters.')
  .max(50, 'Name must not exceed 50 characters.')
  .regex(/^[A-Za-z\s-]+$/, 'Name may only contain letters, spaces, and hyphens.');

export const otpCode = z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits.');

export const isoDateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format.');

/**
 * Common pagination query params, shared by every list endpoint
 * (TRD 11.3, 26).
 */
export const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE).optional(),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  search: z.string().max(100).optional(),
});

export const dateRangeQuery = z.object({
  startDate: isoDateString.optional(),
  endDate: isoDateString.optional(),
});
