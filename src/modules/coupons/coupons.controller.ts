import type { Request, Response } from 'express';

import type {
  CouponIdParamsDto,
  CreateCouponDto,
  ListCouponsQueryDto,
  PauseCouponDto,
  UpdateCouponDto,
  ValidateCouponDto,
} from '@/modules/coupons/coupons.dto';
import type { CouponsService } from '@/modules/coupons/coupons.service';
import { AuthenticationError } from '@/utils/errors';
import { successResponse } from '@/utils/responseFormatter';

function requireUserId(req: Request): string {
  if (!req.user) {
    throw new AuthenticationError('Please log in to continue.');
  }
  return req.user.userId;
}

export class CouponsController {
  constructor(private readonly service: CouponsService) {}

  validate = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as ValidateCouponDto;
    const result = await this.service.validateCoupon(dto, requireUserId(req));
    successResponse(res, result, 'Coupon validated successfully.');
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as ListCouponsQueryDto;
    const result = await this.service.listCoupons(query);
    successResponse(res, result, 'Coupons retrieved successfully.');
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as CreateCouponDto;
    const result = await this.service.createCoupon(dto, requireUserId(req));
    successResponse(res, result, 'Coupon created successfully.', 201);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as CouponIdParamsDto;
    const dto = req.body as UpdateCouponDto;
    const result = await this.service.updateCoupon(id, dto, requireUserId(req));
    successResponse(res, result, 'Coupon updated successfully.');
  };

  pause = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as CouponIdParamsDto;
    const dto = req.body as PauseCouponDto;
    const result = await this.service.pauseCoupon(id, dto, requireUserId(req));
    successResponse(res, result, 'Coupon status updated successfully.');
  };
}
