import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

import { CouponDiscountType } from '@/types/domain.types';

export interface ICouponRestrictions {
  minOrderValuePaise: number;
  maxDiscountPaise?: number;
  userSegment: 'all' | 'new_user';
  applicableRestaurantIds: Types.ObjectId[];
}

/**
 * `coupons` collection (TRD 12.1). Restrictions object embedded per the
 * documented embedding strategy.
 */
export interface ICoupon extends Document {
  code: string;
  description?: string;
  discountType: CouponDiscountType;
  discountValue: number;
  restrictions: ICouponRestrictions;
  maxTotalUsage: number;
  perUserUsageLimit: number;
  totalUsageCount: number;
  isActive: boolean;
  isPaused: boolean;
  validFrom: Date;
  validUntil: Date;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, minlength: 4, maxlength: 20 },
    description: { type: String },
    discountType: { type: String, enum: Object.values(CouponDiscountType), required: true },
    discountValue: { type: Number, required: true, min: 0 },
    restrictions: {
      minOrderValuePaise: { type: Number, default: 0, min: 0 },
      maxDiscountPaise: { type: Number },
      userSegment: { type: String, enum: ['all', 'new_user'], default: 'all' },
      applicableRestaurantIds: { type: [Schema.Types.ObjectId], ref: 'Restaurant', default: [] },
    },
    maxTotalUsage: { type: Number, required: true, min: 1 },
    perUserUsageLimit: { type: Number, required: true, min: 1, default: 1 },
    totalUsageCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    isPaused: { type: Boolean, default: false },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export const CouponModel = model<ICoupon>('Coupon', couponSchema);
