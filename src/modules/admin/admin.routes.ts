import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/role.middleware';
import { validate } from '@/middleware/validate.middleware';
import { AdminController } from '@/modules/admin/admin.controller';
import {
  approveRestaurantSchema,
  listAdminOrdersQuerySchema,
  listAuditLogsQuerySchema,
  listRestaurantApplicationsQuerySchema,
  orderIdParamsSchema,
  overrideOrderStatusSchema,
  restaurantIdParamsSchema,
  suspendRestaurantSchema,
} from '@/modules/admin/admin.dto';
import { AdminRepository } from '@/modules/admin/admin.repository';
import { AdminService } from '@/modules/admin/admin.service';
import { analyticsRoutes } from '@/modules/analytics/analytics.routes';
import { reportsRoutes } from '@/modules/reports/reports.routes';
import { UserRole } from '@/types/domain.types';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

const repository = new AdminRepository();
const service = new AdminService(repository);
const controller = new AdminController(service);

// Every route below (including the mounted analytics/reports
// sub-routers) requires an authenticated admin/super_admin — applied
// once here rather than per-route (TRD 14.1).
router.use(authMiddleware, requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]));

/**
 * @openapi
 * /admin/orders:
 *   get:
 *     summary: List all orders (admin, paginated/filterable)
 *     tags: [Admin]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Orders retrieved }
 */
router.get('/orders', validate({ query: listAdminOrdersQuerySchema }), asyncHandler(controller.listAllOrders));

/**
 * @openapi
 * /admin/orders/{id}/status:
 *   patch:
 *     summary: Override an order's status for operational reasons
 *     tags: [Admin]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Order status overridden }
 */
router.patch(
  '/orders/:id/status',
  validate({ params: orderIdParamsSchema, body: overrideOrderStatusSchema }),
  asyncHandler(controller.overrideOrderStatus),
);

/**
 * @openapi
 * /admin/restaurants:
 *   get:
 *     summary: List all restaurant applications (admin)
 *     tags: [Admin]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Restaurant applications retrieved }
 */
router.get(
  '/restaurants',
  validate({ query: listRestaurantApplicationsQuerySchema }),
  asyncHandler(controller.listRestaurantApplications),
);

/**
 * @openapi
 * /admin/restaurants/{id}/approve:
 *   patch:
 *     summary: Approve a restaurant application
 *     tags: [Admin]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Restaurant approved }
 */
router.patch(
  '/restaurants/:id/approve',
  validate({ params: restaurantIdParamsSchema, body: approveRestaurantSchema }),
  asyncHandler(controller.approveRestaurant),
);

/**
 * @openapi
 * /admin/restaurants/{id}/suspend:
 *   patch:
 *     summary: Suspend a restaurant
 *     tags: [Admin]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Restaurant suspended }
 */
router.patch(
  '/restaurants/:id/suspend',
  validate({ params: restaurantIdParamsSchema, body: suspendRestaurantSchema }),
  asyncHandler(controller.suspendRestaurant),
);

/**
 * @openapi
 * /admin/audit-logs:
 *   get:
 *     summary: Paginated audit log
 *     tags: [Admin]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Audit logs retrieved }
 */
router.get('/audit-logs', validate({ query: listAuditLogsQuerySchema }), asyncHandler(controller.listAuditLogs));

router.use('/reports', reportsRoutes);
router.use('/analytics', analyticsRoutes);

export const adminRoutes = router;
