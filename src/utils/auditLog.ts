import { AuditLogModel } from '@/models/AuditLog.model';
import type { AuditAction } from '@/types/domain.types';

export interface WriteAuditLogParams {
  actor: { userId: string; name: string; role: string };
  action: AuditAction;
  module: string;
  resourceId?: string;
  before?: unknown;
  after?: unknown;
  ipAddress: string;
  userAgent: string;
  requestId: string;
}

/**
 * Persists an immutable audit log entry (TRD 21.3, PRD 11.20). Any
 * module performing a privileged or auth-sensitive mutation should call
 * this rather than writing to `AuditLogModel` directly, keeping the
 * document shape consistent.
 */
export async function writeAuditLog(params: WriteAuditLogParams): Promise<void> {
  await AuditLogModel.create(params);
}
