import type { Request, Response } from 'express';

import type {
  ApproveRestaurantDto,
  ListAdminOrdersQueryDto,
  ListAuditLogsQueryDto,
  ListRestaurantApplicationsQueryDto,
  OrderIdParamsDto,
  OverrideOrderStatusDto,
  RestaurantIdParamsDto,
  SuspendRestaurantDto,
} from '@/modules/admin/admin.dto';
import type { AdminService } from '@/modules/admin/admin.service';
import { AuthenticationError } from '@/utils/errors';
import { successResponse } from '@/utils/responseFormatter';

function requireUserId(req: Request): string {
  if (!req.user) {
    throw new AuthenticationError('Please log in to continue.');
  }
  return req.user.userId;
}

/**
 * Admin HTTP handlers for cross-module operations (TRD 10.2, 11.4).
 * Mounted under `/admin` with authMiddleware + requireRole(['admin',
 * 'super_admin']) applied at the router level.
 */
export class AdminController {
  constructor(private readonly service: AdminService) {}

  listAllOrders = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as ListAdminOrdersQueryDto;
    const result = await this.service.listAllOrders(query);
    successResponse(res, result, 'Orders retrieved successfully.');
  };

  overrideOrderStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as OrderIdParamsDto;
    const dto = req.body as OverrideOrderStatusDto;
    const result = await this.service.overrideOrderStatus(id, dto, requireUserId(req));
    successResponse(res, result, 'Order status overridden successfully.');
  };

  listRestaurantApplications = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as ListRestaurantApplicationsQueryDto;
    const result = await this.service.listRestaurantApplications(query);
    successResponse(res, result, 'Restaurant applications retrieved successfully.');
  };

  approveRestaurant = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as RestaurantIdParamsDto;
    const dto = req.body as ApproveRestaurantDto;
    const result = await this.service.approveRestaurant(id, dto, requireUserId(req));
    successResponse(res, result, 'Restaurant approved successfully.');
  };

  suspendRestaurant = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as RestaurantIdParamsDto;
    const dto = req.body as SuspendRestaurantDto;
    const result = await this.service.suspendRestaurant(id, dto, requireUserId(req));
    successResponse(res, result, 'Restaurant suspended successfully.');
  };

  listAuditLogs = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as ListAuditLogsQueryDto;
    const result = await this.service.listAuditLogs(query);
    successResponse(res, result, 'Audit logs retrieved successfully.');
  };
}
