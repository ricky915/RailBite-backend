import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth.middleware';
import { publicRateLimiter } from '@/middleware/rateLimiter';
import { validate } from '@/middleware/validate.middleware';
import { RatingsController } from '@/modules/ratings/ratings.controller';
import {
  createRatingSchema,
  listRatingsQuerySchema,
  ratingIdParamsSchema,
  restaurantIdParamsSchema,
  updateRatingSchema,
} from '@/modules/ratings/ratings.dto';
import { RatingsRepository } from '@/modules/ratings/ratings.repository';
import { RatingsService } from '@/modules/ratings/ratings.service';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

const repository = new RatingsRepository();
const service = new RatingsService(repository);
const controller = new RatingsController(service);

/**
 * @openapi
 * /ratings:
 *   post:
 *     summary: Submit a rating and review for a delivered order
 *     tags: [Ratings]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201: { description: Rating submitted }
 */
router.post(
  '/',
  authMiddleware,
  validate({ body: createRatingSchema }),
  asyncHandler(controller.submit),
);

/**
 * @openapi
 * /ratings/{id}:
 *   patch:
 *     summary: Edit a rating (within the 48-hour edit window)
 *     tags: [Ratings]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Rating updated }
 */
router.patch(
  '/:id',
  authMiddleware,
  validate({ params: ratingIdParamsSchema, body: updateRatingSchema }),
  asyncHandler(controller.update),
);

/**
 * @openapi
 * /ratings/restaurant/{restaurantId}:
 *   get:
 *     summary: List reviews for a restaurant (paginated)
 *     tags: [Ratings]
 *     responses:
 *       200: { description: Reviews retrieved }
 */
router.get(
  '/restaurant/:restaurantId',
  publicRateLimiter,
  validate({ params: restaurantIdParamsSchema, query: listRatingsQuerySchema }),
  asyncHandler(controller.listByRestaurant),
);

export const ratingsRoutes = router;
