import { z } from 'zod';

import { CouponDiscountType } from '@/types/domain.types';
import { isoDateString, mongoId, paginationQuery } from '@/validations/common.validations';

export const validateCouponSchema = z.object({
  code: z
    .string()
    .min(4, 'Coupon code must be at least 4 characters.')
    .max(20, 'Coupon code must not exceed 20 characters.')
    .transform((value) => value.toUpperCase()),
  cartSubtotalPaise: z.number().int().positive(),
  restaurantId: mongoId,
});
export type ValidateCouponDto = z.infer<typeof validateCouponSchema>;

export const createCouponSchema = z.object({
  code: z.string().min(4).max(20).transform((value) => value.toUpperCase()),
  description: z.string().max(200).optional(),
  discountType: z.nativeEnum(CouponDiscountType),
  discountValue: z.number().positive(),
  minOrderValuePaise: z.number().int().min(0).default(0),
  maxDiscountPaise: z.number().int().positive().optional(),
  userSegment: z.enum(['all', 'new_user']).default('all'),
  applicableRestaurantIds: z.array(mongoId).default([]),
  maxTotalUsage: z.number().int().positive(),
  perUserUsageLimit: z.number().int().positive().default(1),
  validFrom: isoDateString,
  validUntil: isoDateString,
});
export type CreateCouponDto = z.infer<typeof createCouponSchema>;

export const updateCouponSchema = createCouponSchema.partial();
export type UpdateCouponDto = z.infer<typeof updateCouponSchema>;

export const couponIdParamsSchema = z.object({ id: mongoId });
export type CouponIdParamsDto = z.infer<typeof couponIdParamsSchema>;

export const listCouponsQuerySchema = paginationQuery.extend({
  isActive: z.coerce.boolean().optional(),
});
export type ListCouponsQueryDto = z.infer<typeof listCouponsQuerySchema>;

export const pauseCouponSchema = z.object({
  isPaused: z.boolean(),
});
export type PauseCouponDto = z.infer<typeof pauseCouponSchema>;
