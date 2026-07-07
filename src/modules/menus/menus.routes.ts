import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/role.middleware';
import { validate } from '@/middleware/validate.middleware';
import { MenusController } from '@/modules/menus/menus.controller';
import {
  createMenuCategorySchema,
  createMenuItemSchema,
  menuIdParamsSchema,
  menuItemParamsSchema,
  toggleItemAvailabilitySchema,
  updateMenuCategorySchema,
  updateMenuItemSchema,
} from '@/modules/menus/menus.dto';
import { MenusRepository } from '@/modules/menus/menus.repository';
import { MenusService } from '@/modules/menus/menus.service';
import { UserRole } from '@/types/domain.types';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

const repository = new MenusRepository();
const service = new MenusService(repository);
const controller = new MenusController(service);

const restaurantStaffRoles = [
  UserRole.RESTAURANT_MANAGER,
  UserRole.RESTAURANT_STAFF,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

/**
 * @openapi
 * /menus:
 *   post:
 *     summary: Create a menu category for a restaurant
 *     tags: [Menus]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201: { description: Menu category created }
 */
router.post(
  '/',
  authMiddleware,
  requireRole(restaurantStaffRoles),
  validate({ body: createMenuCategorySchema }),
  asyncHandler(controller.createCategory),
);

/**
 * @openapi
 * /menus/{id}:
 *   patch:
 *     summary: Update a menu category
 *     tags: [Menus]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Menu category updated }
 */
router.patch(
  '/:id',
  authMiddleware,
  requireRole(restaurantStaffRoles),
  validate({ params: menuIdParamsSchema, body: updateMenuCategorySchema }),
  asyncHandler(controller.updateCategory),
);

/**
 * @openapi
 * /menus/{id}:
 *   delete:
 *     summary: Delete a menu category
 *     tags: [Menus]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Menu category deleted }
 */
router.delete(
  '/:id',
  authMiddleware,
  requireRole(restaurantStaffRoles),
  validate({ params: menuIdParamsSchema }),
  asyncHandler(controller.deleteCategory),
);

/**
 * @openapi
 * /menus/{id}/items:
 *   post:
 *     summary: Add a menu item to a category
 *     tags: [Menus]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201: { description: Menu item added }
 */
router.post(
  '/:id/items',
  authMiddleware,
  requireRole(restaurantStaffRoles),
  validate({ params: menuIdParamsSchema, body: createMenuItemSchema }),
  asyncHandler(controller.addItem),
);

/**
 * @openapi
 * /menus/{id}/items/{itemId}:
 *   patch:
 *     summary: Update a menu item
 *     tags: [Menus]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Menu item updated }
 */
router.patch(
  '/:id/items/:itemId',
  authMiddleware,
  requireRole(restaurantStaffRoles),
  validate({ params: menuItemParamsSchema, body: updateMenuItemSchema }),
  asyncHandler(controller.updateItem),
);

/**
 * @openapi
 * /menus/{id}/items/{itemId}:
 *   delete:
 *     summary: Remove a menu item
 *     tags: [Menus]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Menu item removed }
 */
router.delete(
  '/:id/items/:itemId',
  authMiddleware,
  requireRole(restaurantStaffRoles),
  validate({ params: menuItemParamsSchema }),
  asyncHandler(controller.removeItem),
);

/**
 * @openapi
 * /menus/{id}/items/{itemId}/availability:
 *   patch:
 *     summary: Toggle a menu item's availability (in stock / out of stock)
 *     tags: [Menus]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Menu item availability updated }
 */
router.patch(
  '/:id/items/:itemId/availability',
  authMiddleware,
  requireRole(restaurantStaffRoles),
  validate({ params: menuItemParamsSchema, body: toggleItemAvailabilitySchema }),
  asyncHandler(controller.toggleAvailability),
);

export const menusRoutes = router;
