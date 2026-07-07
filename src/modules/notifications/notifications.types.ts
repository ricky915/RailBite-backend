import type { NotificationChannel, NotificationStatus } from '@/types/domain.types';

export interface NotificationView {
  id: string;
  channel: NotificationChannel;
  templateKey: string;
  subject?: string;
  content: string;
  status: NotificationStatus;
  isRead: boolean;
  createdAt: Date;
}

export interface BroadcastResult {
  totalRecipients: number;
  dispatchedCount: number;
}
