import type {
  ApproveRestaurantDto,
  ListAdminOrdersQueryDto,
  ListAuditLogsQueryDto,
  ListRestaurantApplicationsQueryDto,
  OverrideOrderStatusDto,
  SuspendRestaurantDto,
} from '@/modules/admin/admin.dto';
import type { AdminRepository } from '@/modules/admin/admin.repository';
import type {
  AdminOrderListItemView,
  AdminRestaurantApplicationView,
  AuditLogEntryView,
} from '@/modules/admin/admin.types';
import type { PaginatedResult } from '@/types/domain.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Admin-only cross-module business logic (PRD 11.15, 11.16, 11.20).
 * Scaffold: all admin override/approval/audit-log queries are planned
 * for a later phase; every mutation here must be written to the audit
 * log once implemented (TRD 21.3).
 */
export class AdminService {
  constructor(private readonly repository: AdminRepository) {}

  listAllOrders(query: ListAdminOrdersQueryDto): Promise<PaginatedResult<AdminOrderListItemView>> {
    throw new NotImplementedError(
      `AdminService.listAllOrders(${JSON.stringify(query)}) is not yet implemented.`,
    );
  }

  overrideOrderStatus(
    id: string,
    dto: OverrideOrderStatusDto,
    adminUserId: string,
  ): Promise<AdminOrderListItemView> {
    throw new NotImplementedError(
      `AdminService.overrideOrderStatus(${id}, status=${dto.status}, admin=${adminUserId}) is not yet implemented.`,
    );
  }

  listRestaurantApplications(
    query: ListRestaurantApplicationsQueryDto,
  ): Promise<PaginatedResult<AdminRestaurantApplicationView>> {
    throw new NotImplementedError(
      `AdminService.listRestaurantApplications(${JSON.stringify(query)}) is not yet implemented.`,
    );
  }

  approveRestaurant(
    id: string,
    dto: ApproveRestaurantDto,
    adminUserId: string,
  ): Promise<AdminRestaurantApplicationView> {
    throw new NotImplementedError(
      `AdminService.approveRestaurant(${id}, admin=${adminUserId}, comments=${dto.comments ?? ''}) is not yet implemented.`,
    );
  }

  suspendRestaurant(
    id: string,
    dto: SuspendRestaurantDto,
    adminUserId: string,
  ): Promise<AdminRestaurantApplicationView> {
    throw new NotImplementedError(
      `AdminService.suspendRestaurant(${id}, admin=${adminUserId}, reason=${dto.reason}) is not yet implemented.`,
    );
  }

  listAuditLogs(query: ListAuditLogsQueryDto): Promise<PaginatedResult<AuditLogEntryView>> {
    throw new NotImplementedError(
      `AdminService.listAuditLogs(${JSON.stringify(query)}) is not yet implemented.`,
    );
  }
}
