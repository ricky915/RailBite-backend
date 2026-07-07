import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/role.middleware';
import { validate } from '@/middleware/validate.middleware';
import { NotificationsController } from '@/modules/notifications/notifications.controller';
import {
  broadcastNotificationSchema,
  listNotificationsQuerySchema,
  notificationIdParamsSchema,
} from '@/modules/notifications/notifications.dto';
import { NotificationsRepository } from '@/modules/notifications/notifications.repository';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import { UserRole } from '@/types/domain.types';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

const repository = new NotificationsRepository();
const service = new NotificationsService(repository);
const controller = new NotificationsController(service);

/**
 * @openapi
 * /notifications:
 *   get:
 *     summary: List the authenticated user's in-app notifications
 *     tags: [Notifications]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Notifications retrieved }
 */
router.get(
  '/',
  authMiddleware,
  validate({ query: listNotificationsQuerySchema }),
  asyncHandler(controller.list),
);

/**
 * @openapi
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Notification marked as read }
 */
router.patch(
  '/:id/read',
  authMiddleware,
  validate({ params: notificationIdParamsSchema }),
  asyncHandler(controller.markRead),
);

/**
 * @openapi
 * /notifications/broadcast:
 *   post:
 *     summary: Broadcast a notification to all or segmented users (admin)
 *     tags: [Notifications]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201: { description: Broadcast dispatched }
 */
router.post(
  '/broadcast',
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validate({ body: broadcastNotificationSchema }),
  asyncHandler(controller.broadcast),
);

export const notificationsRoutes = router;
