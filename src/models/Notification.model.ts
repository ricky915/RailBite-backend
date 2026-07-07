import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

import { NotificationChannel, NotificationStatus } from '@/types/domain.types';

/**
 * `notifications` collection (TRD 12.1). Dispatch log referencing user
 * and, where applicable, the triggering order.
 */
export interface INotification extends Document {
  userId: Types.ObjectId;
  orderId?: Types.ObjectId;
  channel: NotificationChannel;
  templateKey: string;
  subject?: string;
  content: string;
  status: NotificationStatus;
  retryCount: number;
  errorMessage?: string;
  isRead: boolean;
  sentAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    channel: { type: String, enum: Object.values(NotificationChannel), required: true },
    templateKey: { type: String, required: true },
    subject: { type: String, maxlength: 100 },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(NotificationStatus),
      default: NotificationStatus.PENDING,
    },
    retryCount: { type: Number, default: 0, min: 0, max: 3 },
    errorMessage: { type: String },
    isRead: { type: Boolean, default: false },
    sentAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true },
);

notificationSchema.index({ userId: 1, createdAt: -1 });

export const NotificationModel = model<INotification>('Notification', notificationSchema);
