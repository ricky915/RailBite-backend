import type { ICoupon } from '@/models/Coupon.model';
import type { ICouponUsage } from '@/models/CouponUsage.model';
import type { PaginatedResult } from '@/types/domain.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Data access for the coupons module (TRD 3.2.4, 5.3, `coupons` +
 * `couponUsages` collections). Scaffold: eligibility/usage-limit queries
 * and admin CRUD persistence are planned for a later phase.
 */
export class CouponsRepository {
  findByCode(code: string): Promise<ICoupon | null> {
    throw new NotImplementedError(`CouponsRepository.findByCode(${code}) is not yet implemented.`);
  }

  findById(id: string): Promise<ICoupon | null> {
    throw new NotImplementedError(`CouponsRepository.findById(${id}) is not yet implemented.`);
  }

  findMany(filter: Record<string, unknown>, skip: number, limit: number): Promise<PaginatedResult<ICoupon>> {
    throw new NotImplementedError(
      `CouponsRepository.findMany(${JSON.stringify(filter)}, skip=${skip}, limit=${limit}) is not yet implemented.`,
    );
  }

  create(data: Partial<ICoupon>): Promise<ICoupon> {
    throw new NotImplementedError(`CouponsRepository.create(${JSON.stringify(data)}) is not yet implemented.`);
  }

  updateById(id: string, data: Partial<ICoupon>): Promise<ICoupon | null> {
    throw new NotImplementedError(
      `CouponsRepository.updateById(${id}, ${JSON.stringify(data)}) is not yet implemented.`,
    );
  }

  countUsageByUser(couponId: string, userId: string): Promise<number> {
    throw new NotImplementedError(
      `CouponsRepository.countUsageByUser(${couponId}, ${userId}) is not yet implemented.`,
    );
  }

  createUsageRecord(data: Partial<ICouponUsage>): Promise<ICouponUsage> {
    throw new NotImplementedError(
      `CouponsRepository.createUsageRecord(${JSON.stringify(data)}) is not yet implemented.`,
    );
  }
}
