import { NotificationModel } from '@/models/Notification.model';
import { sendEmail } from '@/services/email.service';
import { sendSmsWithRetry } from '@/services/sms.service';
import { NotificationChannel, NotificationStatus } from '@/types/domain.types';
import { logger } from '@/utils/logger';

export interface DispatchNotificationParams {
  userId: string;
  orderId?: string;
  channel: NotificationChannel;
  templateKey: string;
  recipient: string; // mobile number or email address depending on channel
  subject?: string;
  content: string;
  smsTemplateId?: string;
  smsVariables?: Record<string, string>;
}

/**
 * Orchestrates SMS + email + in-app notification dispatch by event type
 * (TRD 5.5). This is the ONLY module permitted to call `email.service.ts`
 * / `sms.service.ts` directly — order/payment/support/auth services must
 * go through here rather than embedding notification logic themselves
 * (TRD 30.2 migration guardrail).
 *
 * Dispatch failures are logged and reflected on the notification record's
 * `status`/`errorMessage` rather than thrown, so a notification failure
 * never blocks the primary business operation (TRD 20.2 "Async
 * Notifications").
 */
export async function dispatchNotification(params: DispatchNotificationParams): Promise<void> {
  const notification = await NotificationModel.create({
    userId: params.userId,
    orderId: params.orderId,
    channel: params.channel,
    templateKey: params.templateKey,
    subject: params.subject,
    content: params.content,
    status: NotificationStatus.PENDING,
  });

  try {
    if (params.channel === NotificationChannel.EMAIL) {
      await sendEmail({
        to: params.recipient,
        subject: params.subject ?? 'RailBite Notification',
        html: params.content,
      });
    } else if (params.channel === NotificationChannel.SMS) {
      await sendSmsWithRetry({
        mobile: params.recipient,
        templateId: params.smsTemplateId ?? params.templateKey,
        variables: params.smsVariables ?? {},
      });
    }
    // NotificationChannel.IN_APP: persisting the document above is
    // sufficient; in-app notifications are read via the notifications API.

    notification.status = NotificationStatus.SENT;
    notification.sentAt = new Date();
    await notification.save();
  } catch (error) {
    notification.status = NotificationStatus.FAILED;
    notification.retryCount += 1;
    notification.errorMessage = error instanceof Error ? error.message : 'Unknown dispatch error';
    await notification.save();
    logger.error('Notification dispatch failed', {
      notificationId: notification.id,
      channel: params.channel,
      templateKey: params.templateKey,
    });
  }
}

/**
 * Fire-and-forget wrapper so callers (order/payment/auth services) never
 * await notification dispatch on the request/response critical path.
 */
export function dispatchNotificationAsync(params: DispatchNotificationParams): void {
  setImmediate(() => {
    dispatchNotification(params).catch((error: unknown) => {
      logger.error('Unhandled notification dispatch error', {
        error: error instanceof Error ? error.message : error,
      });
    });
  });
}
