import type { Request, Response } from 'express';

import type {
  BroadcastNotificationDto,
  ListNotificationsQueryDto,
  NotificationIdParamsDto,
} from '@/modules/notifications/notifications.dto';
import type { NotificationsService } from '@/modules/notifications/notifications.service';
import { AuthenticationError } from '@/utils/errors';
import { successResponse } from '@/utils/responseFormatter';

function requireUserId(req: Request): string {
  if (!req.user) {
    throw new AuthenticationError('Please log in to continue.');
  }
  return req.user.userId;
}

export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as ListNotificationsQueryDto;
    const result = await this.service.listOwnNotifications(query, requireUserId(req));
    successResponse(res, result, 'Notifications retrieved successfully.');
  };

  markRead = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as NotificationIdParamsDto;
    const result = await this.service.markAsRead(id, requireUserId(req));
    successResponse(res, result, 'Notification marked as read.');
  };

  broadcast = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as BroadcastNotificationDto;
    const result = await this.service.broadcast(dto, requireUserId(req));
    successResponse(res, result, 'Broadcast dispatched successfully.', 201);
  };
}
