import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

export type OtpPurpose = 'registration' | 'login' | 'password_reset' | 'mobile_change';

/**
 * `otps` collection (TRD 12.1, 13.4). Active OTP records for mobile/email
 * verification. TTL-indexed with a 10-minute expiry (PRD 11.1).
 */
export interface IOtp extends Document {
  userId?: Types.ObjectId;
  identifier: string; // mobile or email the OTP was sent to
  otpHash: string;
  purpose: OtpPurpose;
  attemptCount: number;
  resendCount: number;
  isVerified: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    identifier: { type: String, required: true },
    otpHash: { type: String, required: true },
    purpose: {
      type: String,
      enum: ['registration', 'login', 'password_reset', 'mobile_change'],
      required: true,
    },
    attemptCount: { type: Number, default: 0 },
    resendCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

// TRD 12.3: TTL index (expireAfterSeconds: 0) — auto-delete expired OTPs.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ identifier: 1, purpose: 1 });

export const OtpModel = model<IOtp>('Otp', otpSchema);
