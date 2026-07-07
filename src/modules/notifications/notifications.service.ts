import type {
  BroadcastNotificationDto,
  ListNotificationsQueryDto,
} from '@/modules/notifications/notifications.dto';
import type { NotificationsRepository } from '@/modules/notifications/notifications.repository';
import type { BroadcastResult, NotificationView } from '@/modules/notifications/notifications.types';
import type { PaginatedResult } from '@/types/domain.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * In-app notification listing and admin broadcast business logic
 * (PRD 11.11). Scaffold: segmentation and the actual broadcast fan-out
 * (delegating to the shared `notification.service.ts`) are planned for a
 * later phase.
 */
export class NotificationsService {
  constructor(private readonly repository: NotificationsRepository) {}

  listOwnNotifications(
    query: ListNotificationsQueryDto,
    userId: string,
  ): Promise<PaginatedResult<NotificationView>> {
    throw new NotImplementedError(
      `NotificationsService.listOwnNotifications(user=${userId}, ${JSON.stringify(query)}) is not yet implemented.`,
    );
  }

  markAsRead(id: string, userId: string): Promise<NotificationView> {
    throw new NotImplementedError(
      `NotificationsService.markAsRead(${id}, user=${userId}) is not yet implemented.`,
    );
  }

  broadcast(dto: BroadcastNotificationDto, adminUserId: string): Promise<BroadcastResult> {
    throw new NotImplementedError(
      `NotificationsService.broadcast(segment=${dto.segment}, admin=${adminUserId}) is not yet implemented.`,
    );
  }
}
