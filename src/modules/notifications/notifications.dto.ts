import { z } from 'zod';

import { NotificationChannel } from '@/types/domain.types';
import { mongoId, paginationQuery } from '@/validations/common.validations';

export const listNotificationsQuerySchema = paginationQuery.extend({
  isRead: z.coerce.boolean().optional(),
});
export type ListNotificationsQueryDto = z.infer<typeof listNotificationsQuerySchema>;

export const notificationIdParamsSchema = z.object({ id: mongoId });
export type NotificationIdParamsDto = z.infer<typeof notificationIdParamsSchema>;

export const broadcastNotificationSchema = z.object({
  channel: z.nativeEnum(NotificationChannel),
  subject: z.string().max(100).optional(),
  content: z.string().min(1).max(2000),
  segment: z.enum(['all', 'active_last_30_days', 'new_users']).default('all'),
});
export type BroadcastNotificationDto = z.infer<typeof broadcastNotificationSchema>;
