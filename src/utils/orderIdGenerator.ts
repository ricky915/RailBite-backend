import { ORDER_ID_PREFIX } from '@/config/constants';

/**
 * Generates a human-readable order ID in the format `RB-YYYY-NNNNN`
 * (TRD 3.4, 12.2.2). `sequence` should come from an atomic counter
 * (e.g., a Mongo findOneAndUpdate on a counters collection) supplied by
 * the caller — this function is a pure formatter with no side effects.
 */
export function generateOrderId(sequence: number, date: Date = new Date()): string {
  const year = date.getUTCFullYear();
  const padded = String(sequence).padStart(5, '0');
  return `${ORDER_ID_PREFIX}-${year}-${padded}`;
}

/**
 * Generates a 6-digit numeric OTP (PRD 11.1 validation rules).
 */
export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
