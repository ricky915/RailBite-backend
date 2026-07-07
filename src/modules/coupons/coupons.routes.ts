import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/role.middleware';
import { validate } from '@/middleware/validate.middleware';
import { CouponsController } from '@/modules/coupons/coupons.controller';
import {
  couponIdParamsSchema,
  createCouponSchema,
  listCouponsQuerySchema,
  pauseCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
} from '@/modules/coupons/coupons.dto';
import { CouponsRepository } from '@/modules/coupons/coupons.repository';
import { CouponsService } from '@/modules/coupons/coupons.service';
import { UserRole } from '@/types/domain.types';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

const repository = new CouponsRepository();
const service = new CouponsService(repository);
const controller = new CouponsController(service);

const adminRoles = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

/**
 * @openapi
 * /coupons/validate:
 *   post:
 *     summary: Validate a coupon code against the current cart
 *     tags: [Coupons]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Coupon validation result }
 */
router.post(
  '/validate',
  authMiddleware,
  validate({ body: validateCouponSchema }),
  asyncHandler(controller.validate),
);

/**
 * @openapi
 * /coupons:
 *   get:
 *     summary: List coupons (admin)
 *     tags: [Coupons]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Coupons retrieved }
 */
router.get(
  '/',
  authMiddleware,
  requireRole(adminRoles),
  validate({ query: listCouponsQuerySchema }),
  asyncHandler(controller.list),
);

/**
 * @openapi
 * /coupons:
 *   post:
 *     summary: Create a coupon (admin)
 *     tags: [Coupons]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201: { description: Coupon created }
 */
router.post(
  '/',
  authMiddleware,
  requireRole(adminRoles),
  validate({ body: createCouponSchema }),
  asyncHandler(controller.create),
);

/**
 * @openapi
 * /coupons/{id}:
 *   patch:
 *     summary: Update a coupon (admin)
 *     tags: [Coupons]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Coupon updated }
 */
router.patch(
  '/:id',
  authMiddleware,
  requireRole(adminRoles),
  validate({ params: couponIdParamsSchema, body: updateCouponSchema }),
  asyncHandler(controller.update),
);

/**
 * @openapi
 * /coupons/{id}/pause:
 *   patch:
 *     summary: Pause or resume a coupon (admin)
 *     tags: [Coupons]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Coupon status updated }
 */
router.patch(
  '/:id/pause',
  authMiddleware,
  requireRole(adminRoles),
  validate({ params: couponIdParamsSchema, body: pauseCouponSchema }),
  asyncHandler(controller.pause),
);

export const couponsRoutes = router;
