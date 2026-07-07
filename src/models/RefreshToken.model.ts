import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

/**
 * `refreshTokens` collection (TRD 12.1, 13.1-13.3). Stores only the
 * bcrypt hash of the refresh token, never the raw value. TTL-indexed so
 * expired tokens are automatically purged.
 */
export interface IRefreshToken extends Document {
  userId: Types.ObjectId;
  tokenHash: string;
  tokenVersion: number;
  expiresAt: Date;
  revokedAt?: Date;
  createdByIp?: string;
  createdAt: Date;
  updatedAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tokenHash: { type: String, required: true },
    tokenVersion: { type: Number, required: true, default: 0 },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
    createdByIp: { type: String },
  },
  { timestamps: true },
);

// TRD 12.3: TTL index (expireAfterSeconds: 0) — auto-delete expired tokens.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
refreshTokenSchema.index({ userId: 1 });

export const RefreshTokenModel = model<IRefreshToken>('RefreshToken', refreshTokenSchema);
