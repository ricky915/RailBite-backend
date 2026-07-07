import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

import { SupportTicketCategory, SupportTicketStatus } from '@/types/domain.types';

export interface ITicketMessage {
  senderId: Types.ObjectId;
  senderRole: string;
  message: string;
  attachmentUrls: string[];
  createdAt: Date;
}

/**
 * `supportTickets` collection (TRD 12.1). Embeds the message thread
 * history directly on the ticket document.
 */
export interface ISupportTicket extends Document {
  ticketNumber: string;
  passengerId: Types.ObjectId;
  orderId?: Types.ObjectId;
  category: SupportTicketCategory;
  description: string;
  attachmentUrls: string[];
  status: SupportTicketStatus;
  priority: 'standard' | 'priority';
  assignedTo?: Types.ObjectId;
  messages: ITicketMessage[];
  resolvedAt?: Date;
  closedAt?: Date;
  reopenedAt?: Date;
  csatScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ticketMessageSchema = new Schema<ITicketMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, required: true },
    message: { type: String, required: true },
    attachmentUrls: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const supportTicketSchema = new Schema<ISupportTicket>(
  {
    ticketNumber: { type: String, required: true, unique: true },
    passengerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    category: { type: String, enum: Object.values(SupportTicketCategory), required: true },
    description: { type: String, required: true, minlength: 10, maxlength: 1000 },
    attachmentUrls: { type: [String], default: [] },
    status: {
      type: String,
      enum: Object.values(SupportTicketStatus),
      default: SupportTicketStatus.OPEN,
    },
    priority: { type: String, enum: ['standard', 'priority'], default: 'standard' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    messages: { type: [ticketMessageSchema], default: [] },
    resolvedAt: { type: Date },
    closedAt: { type: Date },
    reopenedAt: { type: Date },
    csatScore: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true },
);

supportTicketSchema.index({ passengerId: 1, status: 1 });
supportTicketSchema.index({ status: 1, priority: 1, createdAt: 1 });

export const SupportTicketModel = model<ISupportTicket>('SupportTicket', supportTicketSchema);
