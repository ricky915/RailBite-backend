import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { CartController } from '@/modules/cart/cart.controller';
import { validateCartSchema } from '@/modules/cart/cart.dto';
import { CartRepository } from '@/modules/cart/cart.repository';
import { CartService } from '@/modules/cart/cart.service';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

const repository = new CartRepository();
const service = new CartService(repository);
const controller = new CartController(service);

/**
 * @openapi
 * /cart/validate:
 *   post:
 *     summary: Server-side cart validation before checkout
 *     tags: [Cart]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Cart validation result }
 *       422: { description: Validation failed }
 */
router.post(
  '/validate',
  authMiddleware,
  validate({ body: validateCartSchema }),
  asyncHandler(controller.validate),
);

export const cartRoutes = router;
