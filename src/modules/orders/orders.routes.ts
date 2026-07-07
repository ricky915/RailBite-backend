import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth.middleware';
import { authenticatedRateLimiter } from '@/middleware/rateLimiter';
import { requireRole } from '@/middleware/role.middleware';
import { validate } from '@/middleware/validate.middleware';
import { OrdersController } from '@/modules/orders/orders.controller';
import {
  cancelOrderSchema,
  createOrderSchema,
  listOrdersQuerySchema,
  orderIdParamsSchema,
  updateOrderStatusSchema,
} from '@/modules/orders/orders.dto';
import { OrdersRepository } from '@/modules/orders/orders.repository';
import { OrdersService } from '@/modules/orders/orders.service';
import { UserRole } from '@/types/domain.types';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

const repository = new OrdersRepository();
const service = new OrdersService(repository);
const controller = new OrdersController(service);

/**
 * @openapi
 * /orders:
 *   post:
 *     summary: Place an order (checkout + payment initiation)
 *     tags: [Orders]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201: { description: Order placed }
 *       422: { description: Validation failed }
 */
router.post(
  '/',
  authMiddleware,
  authenticatedRateLimiter,
  validate({ body: createOrderSchema }),
  asyncHandler(controller.placeOrder),
);

/**
 * @openapi
 * /orders:
 *   get:
 *     summary: List the authenticated passenger's own orders
 *     tags: [Orders]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Orders retrieved }
 */
router.get(
  '/',
  authMiddleware,
  validate({ query: listOrdersQuerySchema }),
  asyncHandler(controller.listOwnOrders),
);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     summary: Get order detail with status timeline
 *     tags: [Orders]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Order detail retrieved }
 *       404: { description: Order not found }
 */
router.get(
  '/:id',
  authMiddleware,
  validate({ params: orderIdParamsSchema }),
  asyncHandler(controller.getOrderDetail),
);

/**
 * @openapi
 * /orders/{id}/cancel:
 *   post:
 *     summary: Cancel an order (subject to cancellation policy)
 *     tags: [Orders]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Order cancelled }
 */
router.post(
  '/:id/cancel',
  authMiddleware,
  validate({ params: orderIdParamsSchema, body: cancelOrderSchema }),
  asyncHandler(controller.cancelOrder),
);

/**
 * @openapi
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status (restaurant staff/manager)
 *     tags: [Orders]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Order status updated }
 */
router.patch(
  '/:id/status',
  authMiddleware,
  requireRole([UserRole.RESTAURANT_MANAGER, UserRole.RESTAURANT_STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validate({ params: orderIdParamsSchema, body: updateOrderStatusSchema }),
  asyncHandler(controller.updateStatus),
);

export const ordersRoutes = router;
