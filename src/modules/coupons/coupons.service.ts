import type {
  CreateCouponDto,
  ListCouponsQueryDto,
  PauseCouponDto,
  UpdateCouponDto,
  ValidateCouponDto,
} from '@/modules/coupons/coupons.dto';
import type { CouponsRepository } from '@/modules/coupons/coupons.repository';
import type { CouponValidationResult, CouponView } from '@/modules/coupons/coupons.types';
import type { PaginatedResult } from '@/types/domain.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Coupon validation and admin management business logic (PRD 11.9,
 * 13.7). Scaffold: eligibility rules (usage caps, user segment, minimum
 * order value, single-coupon-per-order) are planned for a later phase.
 */
export class CouponsService {
  constructor(private readonly repository: CouponsRepository) {}

  validateCoupon(dto: ValidateCouponDto, userId: string): Promise<CouponValidationResult> {
    throw new NotImplementedError(
      `CouponsService.validateCoupon(${dto.code}, user=${userId}) is not yet implemented.`,
    );
  }

  listCoupons(query: ListCouponsQueryDto): Promise<PaginatedResult<CouponView>> {
    throw new NotImplementedError(
      `CouponsService.listCoupons(${JSON.stringify(query)}) is not yet implemented.`,
    );
  }

  createCoupon(dto: CreateCouponDto, adminUserId: string): Promise<CouponView> {
    throw new NotImplementedError(
      `CouponsService.createCoupon(${dto.code}, admin=${adminUserId}) is not yet implemented.`,
    );
  }

  updateCoupon(id: string, dto: UpdateCouponDto, adminUserId: string): Promise<CouponView> {
    throw new NotImplementedError(
      `CouponsService.updateCoupon(${id}, admin=${adminUserId}, ${JSON.stringify(dto)}) is not yet implemented.`,
    );
  }

  pauseCoupon(id: string, dto: PauseCouponDto, adminUserId: string): Promise<CouponView> {
    throw new NotImplementedError(
      `CouponsService.pauseCoupon(${id}, isPaused=${dto.isPaused}, admin=${adminUserId}) is not yet implemented.`,
    );
  }
}
