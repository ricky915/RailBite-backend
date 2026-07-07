import type { INotification } from '@/models/Notification.model';
import type { PaginatedResult } from '@/types/domain.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Data access for the notifications module (TRD 3.2.4, 5.3,
 * `notifications` collection). Note: dispatch itself is owned by the
 * shared `notification.service.ts` (TRD 5.5); this repository only
 * backs the in-app listing/read-state API.
 */
export class NotificationsRepository {
  findMany(
    filter: Record<string, unknown>,
    skip: number,
    limit: number,
  ): Promise<PaginatedResult<INotification>> {
    throw new NotImplementedError(
      `NotificationsRepository.findMany(${JSON.stringify(filter)}, skip=${skip}, limit=${limit}) is not yet implemented.`,
    );
  }

  findById(id: string): Promise<INotification | null> {
    throw new NotImplementedError(`NotificationsRepository.findById(${id}) is not yet implemented.`);
  }

  markAsRead(id: string): Promise<INotification | null> {
    throw new NotImplementedError(`NotificationsRepository.markAsRead(${id}) is not yet implemented.`);
  }

  findRecipientUserIdsForSegment(segment: string): Promise<string[]> {
    throw new NotImplementedError(
      `NotificationsRepository.findRecipientUserIdsForSegment(${segment}) is not yet implemented.`,
    );
  }
}
