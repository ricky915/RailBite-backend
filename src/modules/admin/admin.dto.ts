import { z } from 'zod';

import { approveRestaurantSchema, suspendRestaurantSchema } from '@/modules/restaurants/restaurants.dto';
import { OrderStatus, RestaurantStatus } from '@/types/domain.types';
import { dateRangeQuery, mongoId, paginationQuery } from '@/validations/common.validations';

export const listAdminOrdersQuerySchema = paginationQuery.merge(dateRangeQuery).extend({
  status: z.nativeEnum(OrderStatus).optional(),
  restaurantId: mongoId.optional(),
});
export type ListAdminOrdersQueryDto = z.infer<typeof listAdminOrdersQuerySchema>;

export const orderIdParamsSchema = z.object({ id: mongoId });
export type OrderIdParamsDto = z.infer<typeof orderIdParamsSchema>;

export const overrideOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  reason: z.string().min(3).max(500),
});
export type OverrideOrderStatusDto = z.infer<typeof overrideOrderStatusSchema>;

export const listRestaurantApplicationsQuerySchema = paginationQuery.extend({
  status: z.nativeEnum(RestaurantStatus).optional(),
});
export type ListRestaurantApplicationsQueryDto = z.infer<typeof listRestaurantApplicationsQuerySchema>;

export const restaurantIdParamsSchema = z.object({ id: mongoId });
export type RestaurantIdParamsDto = z.infer<typeof restaurantIdParamsSchema>;

// Re-exported so admin.routes.ts has a single import surface; the
// underlying schemas are owned by the restaurants module DTO file to
// avoid defining the approve/suspend request shape twice.
export { approveRestaurantSchema, suspendRestaurantSchema };
export type { ApproveRestaurantDto, SuspendRestaurantDto } from '@/modules/restaurants/restaurants.dto';

export const listAuditLogsQuerySchema = paginationQuery.merge(dateRangeQuery).extend({
  userId: mongoId.optional(),
  module: z.string().optional(),
  action: z.string().optional(),
});
export type ListAuditLogsQueryDto = z.infer<typeof listAuditLogsQuerySchema>;
