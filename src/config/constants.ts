/**
 * App-wide backend constants.
 * Magic numbers/strings referenced by more than one module must live here
 * (TRD 25.7 - "Magic numbers and strings must be named constants").
 */

// --- Pagination (TRD 26) ---
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// --- Auth / Security (TRD 13, 19) ---
export const BCRYPT_SALT_ROUNDS = 12;
export const MAX_LOGIN_ATTEMPTS = 5;
export const ACCOUNT_LOCK_DURATION_MINUTES = 30;
export const OTP_LENGTH = 6;
export const OTP_TTL_MINUTES = 10;
export const OTP_MAX_RESEND_ATTEMPTS = 3;
export const RESET_TOKEN_TTL_MINUTES = 15;
export const ACCESS_TOKEN_EXPIRY_DEFAULT = '1h';
export const REFRESH_TOKEN_EXPIRY_DEFAULT = '7d';
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
export const OTP_MAX_VERIFY_ATTEMPTS = 5;

// --- Ordering / Delivery (PRD 13.1, 13.3, 13.8) ---
export const MIN_DELIVERY_WINDOW_MINUTES = 45;
export const MAX_CART_QUANTITY = 10;
export const MIN_CART_QUANTITY = 1;
export const COD_MAX_ORDER_VALUE_PAISE = 50000; // Rs. 500
export const AUTO_REFUND_WINDOW_MINUTES = 5;
export const RESTAURANT_RESPONSE_TIMEOUT_MINUTES = 10;
export const AUTO_DELIVERY_CONFIRM_MINUTES = 30;
export const TRAIN_DELAY_ALERT_THRESHOLD_MINUTES = 120;

// --- Cancellation / Refund (PRD 13.4, 13.5) ---
export const FULL_REFUND_WINDOW_MINUTES = 5;
export const PARTIAL_REFUND_WINDOW_MINUTES = 15;
export const PARTIAL_REFUND_PERCENTAGE = 50;
export const REFUND_PROCESSING_DAYS_MIN = 5;
export const REFUND_PROCESSING_DAYS_MAX = 7;
export const DISPUTED_REFUND_APPROVAL_THRESHOLD_PAISE = 50000; // Rs. 500

// --- Ratings (PRD 13.10) ---
export const RATING_WINDOW_DAYS = 7;
export const RATING_EDIT_WINDOW_HOURS = 48;
export const MIN_RATINGS_FOR_AGGREGATE = 5;
export const MAX_REVIEW_LENGTH = 500;
export const MAX_REVIEW_PHOTOS = 3;
export const MAX_REVIEW_PHOTO_SIZE_MB = 5;

// --- Support (PRD 11.14) ---
export const MAX_SUPPORT_DESCRIPTION_LENGTH = 1000;
export const MIN_SUPPORT_DESCRIPTION_LENGTH = 10;
export const MAX_SUPPORT_ATTACHMENTS = 3;
export const SUPPORT_REOPEN_WINDOW_HOURS = 48;

// --- Coupons (PRD 13.7) ---
export const MIN_COUPON_CODE_LENGTH = 4;
export const MAX_COUPON_CODE_LENGTH = 20;

// --- File Uploads (TRD 16.6) ---
export const MAX_IMAGE_UPLOAD_SIZE_MB = 2;
export const MAX_REVIEW_PHOTO_UPLOAD_SIZE_MB = 5;

// --- Currency ---
export const PAISE_PER_RUPEE = 100;

// --- Order ID Generation ---
export const ORDER_ID_PREFIX = 'RB';

// --- Rate limiting defaults (overridden by env in config) ---
export const RATE_LIMIT_PUBLIC_MAX = 100;
export const RATE_LIMIT_AUTHENTICATED_MAX = 500;
export const RATE_LIMIT_WINDOW_MS = 60 * 1000;
