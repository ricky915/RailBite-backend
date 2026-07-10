import { Router } from 'express';

import { requireAuth } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/role.middleware';
import { validate } from '@/middleware/validate.middleware';
import { UserRole } from '@/types/domain.types';

import { menuController } from './menu.controller';
import {
  categoryIdParamSchema,
  createCategorySchema,
  createMenuItemSchema,
  menuItemIdParamSchema,
  setAvailabilitySchema,
  updateCategorySchema,
  updateMenuItemSchema,
} from './menu.dto';

export const menuRoutes = Router();

const manageRoles = [UserRole.RESTAURANT_MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN];
const adminRoles = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

/**
 * @openapi
 * /menu/categories:
 *   get:
 *     summary: List menu categories
 *     tags: [Menu]
 */
menuRoutes.get('/categories', menuController.listCategories);

/**
 * @openapi
 * /menu/categories:
 *   post:
 *     summary: Create a category (admin)
 *     tags: [Menu]
 *     security: [{ bearerAuth: [] }]
 */
menuRoutes.post(
  '/categories',
  requireAuth,
  requireRole(...adminRoles),
  validate({ body: createCategorySchema }),
  menuController.createCategory,
);

/**
 * @openapi
 * /menu/categories/{id}:
 *   patch:
 *     summary: Update a category (admin)
 *     tags: [Menu]
 *     security: [{ bearerAuth: [] }]
 */
menuRoutes.patch(
  '/categories/:id',
  requireAuth,
  requireRole(...adminRoles),
  validate({ params: categoryIdParamSchema, body: updateCategorySchema }),
  menuController.updateCategory,
);

/**
 * @openapi
 * /menu/categories/{id}:
 *   delete:
 *     summary: Soft-delete a category (admin)
 *     tags: [Menu]
 *     security: [{ bearerAuth: [] }]
 */
menuRoutes.delete(
  '/categories/:id',
  requireAuth,
  requireRole(...adminRoles),
  validate({ params: categoryIdParamSchema }),
  menuController.deleteCategory,
);

/**
 * @openapi
 * /menu/items/popular:
 *   get:
 *     summary: Popular/bestseller menu items for the homepage
 *     tags: [Menu]
 */
menuRoutes.get('/items/popular', menuController.popularItems);

/**
 * @openapi
 * /menu/items/{id}:
 *   get:
 *     summary: Menu item detail
 *     tags: [Menu]
 */
menuRoutes.get('/items/:id', validate({ params: menuItemIdParamSchema }), menuController.getItem);

/**
 * @openapi
 * /menu/items:
 *   post:
 *     summary: Create a menu item (restaurant manager/admin)
 *     tags: [Menu]
 *     security: [{ bearerAuth: [] }]
 */
menuRoutes.post(
  '/items',
  requireAuth,
  requireRole(...manageRoles),
  validate({ body: createMenuItemSchema }),
  menuController.createItem,
);

/**
 * @openapi
 * /menu/items/{id}:
 *   patch:
 *     summary: Update a menu item (owner manager/admin)
 *     tags: [Menu]
 *     security: [{ bearerAuth: [] }]
 */
menuRoutes.patch(
  '/items/:id',
  requireAuth,
  requireRole(...manageRoles),
  validate({ params: menuItemIdParamSchema, body: updateMenuItemSchema }),
  menuController.updateItem,
);

/**
 * @openapi
 * /menu/items/{id}/availability:
 *   patch:
 *     summary: Toggle out-of-stock state
 *     tags: [Menu]
 *     security: [{ bearerAuth: [] }]
 */
menuRoutes.patch(
  '/items/:id/availability',
  requireAuth,
  requireRole(...manageRoles),
  validate({ params: menuItemIdParamSchema, body: setAvailabilitySchema }),
  menuController.setAvailability,
);

/**
 * @openapi
 * /menu/items/{id}:
 *   delete:
 *     summary: Soft-delete a menu item (owner manager/admin)
 *     tags: [Menu]
 *     security: [{ bearerAuth: [] }]
 */
menuRoutes.delete(
  '/items/:id',
  requireAuth,
  requireRole(...manageRoles),
  validate({ params: menuItemIdParamSchema }),
  menuController.deleteItem,
);
