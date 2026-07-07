import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/role.middleware';
import { publicRateLimiter } from '@/middleware/rateLimiter';
import { validate } from '@/middleware/validate.middleware';
import { RestaurantsController } from '@/modules/restaurants/restaurants.controller';
import {
  createRestaurantSchema,
  listRestaurantsQuerySchema,
  restaurantIdParamsSchema,
  updateRestaurantSchema,
} from '@/modules/restaurants/restaurants.dto';
import { RestaurantsRepository } from '@/modules/restaurants/restaurants.repository';
import { RestaurantsService } from '@/modules/restaurants/restaurants.service';
import { UserRole } from '@/types/domain.types';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

const repository = new RestaurantsRepository();
const service = new RestaurantsService(repository);
const controller = new RestaurantsController(service);

/**
 * @openapi
 * /restaurants:
 *   get:
 *     summary: List restaurants for a delivery station and time window
 *     tags: [Restaurants]
 *     responses:
 *       200: { description: Restaurants retrieved }
 */
router.get(
  '/',
  publicRateLimiter,
  validate({ query: listRestaurantsQuerySchema }),
  asyncHandler(controller.list),
);

/**
 * @openapi
 * /restaurants/{id}:
 *   get:
 *     summary: Get restaurant detail
 *     tags: [Restaurants]
 *     responses:
 *       200: { description: Restaurant detail retrieved }
 *       404: { description: Restaurant not found }
 */
router.get(
  '/:id',
  publicRateLimiter,
  validate({ params: restaurantIdParamsSchema }),
  asyncHandler(controller.getDetail),
);

/**
 * @openapi
 * /restaurants/{id}/menu:
 *   get:
 *     summary: Get a restaurant's full menu with categories and items
 *     tags: [Restaurants]
 *     responses:
 *       200: { description: Menu retrieved }
 */
router.get(
  '/:id/menu',
  publicRateLimiter,
  validate({ params: restaurantIdParamsSchema }),
  asyncHandler(controller.getMenu),
);

/**
 * @openapi
 * /restaurants:
 *   post:
 *     summary: Submit a new restaurant for onboarding (restaurant manager)
 *     tags: [Restaurants]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201: { description: Onboarding submitted for review }
 */
router.post(
  '/',
  authMiddleware,
  requireRole([UserRole.RESTAURANT_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validate({ body: createRestaurantSchema }),
  asyncHandler(controller.submitOnboarding),
);

/**
 * @openapi
 * /restaurants/{id}:
 *   patch:
 *     summary: Update restaurant profile (own restaurant only)
 *     tags: [Restaurants]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Restaurant updated }
 */
router.patch(
  '/:id',
  authMiddleware,
  requireRole([UserRole.RESTAURANT_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validate({ params: restaurantIdParamsSchema, body: updateRestaurantSchema }),
  asyncHandler(controller.update),
);

/**
 * @openapi
 * /restaurants/{id}/disable:
 *   patch:
 *     summary: Self-service disable of a restaurant (removes from listings)
 *     tags: [Restaurants]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Restaurant disabled }
 */
router.patch(
  '/:id/disable',
  authMiddleware,
  requireRole([UserRole.RESTAURANT_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validate({ params: restaurantIdParamsSchema }),
  asyncHandler(controller.disable),
);

export const restaurantsRoutes = router;
