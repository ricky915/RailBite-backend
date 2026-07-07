import type { CouponDiscountType } from '@/types/domain.types';

export interface CouponValidationResult {
  isValid: boolean;
  code: string;
  discountType: CouponDiscountType;
  discountAmountPaise: number;
  reason?: string;
}

export interface CouponView {
  id: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  isActive: boolean;
  isPaused: boolean;
  validFrom: Date;
  validUntil: Date;
  totalUsageCount: number;
  maxTotalUsage: number;
}
