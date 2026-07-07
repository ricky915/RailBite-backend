import type { Document } from 'mongoose';
import { model, Schema } from 'mongoose';

import { AuditAction } from '@/types/domain.types';

export interface IAuditActor {
  userId: string;
  name: string;
  role: string;
}

/**
 * `auditLogs` collection (TRD 12.1, 21.3). Immutable record of all admin
 * actions; denormalized (no references) for long-term integrity. No
 * `updatedAt` — audit logs are write-once.
 */
export interface IAuditLog extends Document {
  actor: IAuditActor;
  action: AuditAction;
  module: string;
  resourceId?: string;
  before?: unknown;
  after?: unknown;
  ipAddress: string;
  userAgent: string;
  requestId: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actor: {
      userId: { type: String, required: true },
      name: { type: String, required: true },
      role: { type: String, required: true },
    },
    action: { type: String, enum: Object.values(AuditAction), required: true },
    module: { type: String, required: true },
    resourceId: { type: String },
    before: { type: Schema.Types.Mixed },
    after: { type: Schema.Types.Mixed },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    requestId: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

auditLogSchema.index({ 'actor.userId': 1, createdAt: -1 });
auditLogSchema.index({ module: 1, action: 1, createdAt: -1 });

export const AuditLogModel = model<IAuditLog>('AuditLog', auditLogSchema);
