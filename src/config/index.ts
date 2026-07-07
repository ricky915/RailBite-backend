import dotenv from 'dotenv';

dotenv.config();

/**
 * Reads a required environment variable.
 * Throws at startup (fail-fast) if missing, rather than allowing `undefined`
 * to silently propagate into runtime logic.
 */
function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined || value === '') {
    // In non-production environments we allow placeholder fallbacks so that
    // `npm run dev` can boot without every third-party credential configured.
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return fallback ?? '';
  }
  return value;
}

function optionalEnv(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

function numberEnv(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return fallback;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function boolEnv(key: string, fallback: boolean): boolean {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return fallback;
  return raw.toLowerCase() === 'true';
}

/**
 * Single, typed source of truth for all environment configuration.
 * No `process.env` references are permitted outside this module
 * (TRD 3.5.2 / 25.3).
 */
export const config = {
  app: {
    port: numberEnv('PORT', 4000),
    nodeEnv: optionalEnv('NODE_ENV', 'development'),
    apiVersion: optionalEnv('API_VERSION', 'v1'),
  },
  db: {
    mongoUri: requireEnv('MONGO_URI', 'mongodb://localhost:27017/railbite'),
  },
  jwt: {
    accessSecret: requireEnv(
      'JWT_ACCESS_SECRET',
      'dev_access_secret_please_change_this_to_a_random_64_char_string_123456',
    ),
    refreshSecret: requireEnv(
      'JWT_REFRESH_SECRET',
      'dev_refresh_secret_please_change_this_to_a_random_64_char_str_654321',
    ),
    accessExpiry: optionalEnv('JWT_ACCESS_EXPIRY', '1h'),
    refreshExpiry: optionalEnv('JWT_REFRESH_EXPIRY', '7d'),
  },
  cloudinary: {
    cloudName: optionalEnv('CLOUDINARY_CLOUD_NAME'),
    apiKey: optionalEnv('CLOUDINARY_API_KEY'),
    apiSecret: optionalEnv('CLOUDINARY_API_SECRET'),
  },
  razorpay: {
    keyId: optionalEnv('RAZORPAY_KEY_ID'),
    keySecret: optionalEnv('RAZORPAY_KEY_SECRET'),
    webhookSecret: optionalEnv('RAZORPAY_WEBHOOK_SECRET'),
  },
  msg91: {
    authKey: optionalEnv('MSG91_AUTH_KEY'),
    senderId: optionalEnv('MSG91_SENDER_ID', 'RLBITE'),
  },
  sendgrid: {
    apiKey: optionalEnv('SENDGRID_API_KEY'),
    fromEmail: optionalEnv('SENDGRID_FROM_EMAIL', 'no-reply@railbite.local'),
  },
  railApi: {
    baseUrl: optionalEnv('RAIL_API_BASE_URL'),
    apiKey: optionalEnv('RAIL_API_KEY'),
  },
  cors: {
    allowedOrigins: optionalEnv('CORS_ALLOWED_ORIGINS', 'http://localhost:5173').split(','),
  },
  rateLimit: {
    windowMs: numberEnv('RATE_LIMIT_WINDOW_MS', 60_000),
    maxPublic: numberEnv('RATE_LIMIT_MAX_PUBLIC', 100),
    maxAuthenticated: numberEnv('RATE_LIMIT_MAX_AUTHENTICATED', 500),
  },
  bcrypt: {
    saltRounds: numberEnv('BCRYPT_SALT_ROUNDS', 12),
  },
  swagger: {
    enabled: boolEnv('SWAGGER_ENABLED', true),
  },
} as const;

export type Config = typeof config;
