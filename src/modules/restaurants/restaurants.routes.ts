import { Router } from 'express';

import { optionalAuth, requireAuth } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/role.middleware';
import { validate } from '@/middleware/validate.middleware';
import { UserRole } from '@/types/domain.types';

import { restaurantsController } from './restaurants.controller';
import {
  createRestaurantSchema,
  listRestaurantsSchema,
  rejectOrSuspendRestaurantSchema,
  restaurantIdParamSchema,
  updateRestaurantSchema,
} from './restaurants.dto';

export const restaurantsRoutes = Router();

/**
 * @openapi
 * /restaurants:
 *   get:
 *     summary: List approved restaurants (optionally filtered by station/cuisine/search)
 *     tags: [Restaurants]
 */
restaurantsRoutes.get('/', optionalAuth, validate({ query: listRestaurantsSchema }), restaurantsController.list);

/**
 * @openapi
 * /restaurants/popular:
 *   get:
 *     summary: Top-rated restaurants for homepage surfacing
 *     tags: [Restaurants]
 */
restaurantsRoutes.get('/popular', restaurantsController.popular);

/**
 * @openapi
 * /restaurants/{id}:
 *   get:
 *     summary: Restaurant detail
 *     tags: [Restaurants]
 */
restaurantsRoutes.get('/:id', validate({ params: restaurantIdParamSchema }), restaurantsController.getDetail);

/**
 * @openapi
 * /restaurants/{id}/menu:
 *   get:
 *     summary: Categories + menu items for a restaurant
 *     tags: [Restaurants]
 */
restaurantsRoutes.get('/:id/menu', validate({ params: restaurantIdParamSchema }), restaurantsController.getMenu);

/**
 * @openapi
 * /restaurants:
 *   post:
 *     summary: Submit a new restaurant for approval (restaurant_manager)
 *     tags: [Restaurants]
 *     security: [{ bearerAuth: [] }]
 */
restaurantsRoutes.post(
  '/',
  requireAuth,
  requireRole(UserRole.RESTAURANT_MANAGER),
  validate({ body: createRestaurantSchema }),
  restaurantsController.create,
);

/**
 * @openapi
 * /restaurants/{id}:
 *   patch:
 *     summary: Update own restaurant (owner manager or admin)
 *     tags: [Restaurants]
 *     security: [{ bearerAuth: [] }]
 */
restaurantsRoutes.patch(
  '/:id',
  requireAuth,
  requireRole(UserRole.RESTAURANT_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validate({ params: restaurantIdParamSchema, body: updateRestaurantSchema }),
  restaurantsController.update,
);

const adminRoles = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

export const adminRestaurantsRoutes = Router();

/** @openapi /admin/restaurants: get: { summary: List all restaurants including pending/suspended (admin), tags: [Restaurants], security: [{ bearerAuth: [] }] } */
adminRestaurantsRoutes.get(
  '/',
  requireAuth,
  requireRole(...adminRoles),
  validate({ query: listRestaurantsSchema }),
  restaurantsController.list,
);

/** @openapi /admin/restaurants/{id}/approve: patch: { summary: Approve a pending restaurant, tags: [Restaurants], security: [{ bearerAuth: [] }] } */
adminRestaurantsRoutes.patch(
  '/:id/approve',
  requireAuth,
  requireRole(...adminRoles),
  validate({ params: restaurantIdParamSchema }),
  restaurantsController.approve,
);

/** @openapi /admin/restaurants/{id}/reject: patch: { summary: Reject a pending restaurant, tags: [Restaurants], security: [{ bearerAuth: [] }] } */
adminRestaurantsRoutes.patch(
  '/:id/reject',
  requireAuth,
  requireRole(...adminRoles),
  validate({ params: restaurantIdParamSchema, body: rejectOrSuspendRestaurantSchema }),
  restaurantsController.reject,
);

/** @openapi /admin/restaurants/{id}/suspend: patch: { summary: Suspend an active restaurant, tags: [Restaurants], security: [{ bearerAuth: [] }] } */
adminRestaurantsRoutes.patch(
  '/:id/suspend',
  requireAuth,
  requireRole(...adminRoles),
  validate({ params: restaurantIdParamSchema, body: rejectOrSuspendRestaurantSchema }),
  restaurantsController.suspend,
);
