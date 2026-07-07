import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

/**
 * `couponUsages` collection (TRD 12.1). Per-user coupon redemption
 * records; prevents over-use beyond the per-user usage limit.
 */
export interface ICouponUsage extends Document {
  couponId: Types.ObjectId;
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  discountAppliedPaise: number;
  isReversed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const couponUsageSchema = new Schema<ICouponUsage>(
  {
    couponId: { type: Schema.Types.ObjectId, ref: 'Coupon', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    discountAppliedPaise: { type: Number, required: true, min: 0 },
    isReversed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// TRD 12.3: Compound Unique — prevents duplicate coupon use per user per coupon.
couponUsageSchema.index({ couponId: 1, userId: 1 }, { unique: true });

export const CouponUsageModel = model<ICouponUsage>('CouponUsage', couponUsageSchema);
