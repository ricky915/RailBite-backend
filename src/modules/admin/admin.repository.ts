import type { IAuditLog } from '@/models/AuditLog.model';
import type { IOrder } from '@/models/Order.model';
import type { IRestaurant } from '@/models/Restaurant.model';
import type { PaginatedResult } from '@/types/domain.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Data access for admin-only cross-module operations (TRD 4.2 "admin:
 * Admin-only cross-module operations"). This repository intentionally
 * reads/writes the Order/Restaurant/AuditLog models directly rather than
 * depending on the orders/restaurants modules' own repositories, keeping
 * those modules decoupled from admin-specific query shapes.
 * Scaffold: all queries are planned for a later phase.
 */
export class AdminRepository {
  findAllOrders(
    filter: Record<string, unknown>,
    skip: number,
    limit: number,
  ): Promise<PaginatedResult<IOrder>> {
    throw new NotImplementedError(
      `AdminRepository.findAllOrders(${JSON.stringify(filter)}, skip=${skip}, limit=${limit}) is not yet implemented.`,
    );
  }

  findOrderById(id: string): Promise<IOrder | null> {
    throw new NotImplementedError(`AdminRepository.findOrderById(${id}) is not yet implemented.`);
  }

  updateOrderById(id: string, data: Partial<IOrder>): Promise<IOrder | null> {
    throw new NotImplementedError(
      `AdminRepository.updateOrderById(${id}, ${JSON.stringify(data)}) is not yet implemented.`,
    );
  }

  findAllRestaurants(
    filter: Record<string, unknown>,
    skip: number,
    limit: number,
  ): Promise<PaginatedResult<IRestaurant>> {
    throw new NotImplementedError(
      `AdminRepository.findAllRestaurants(${JSON.stringify(filter)}, skip=${skip}, limit=${limit}) is not yet implemented.`,
    );
  }

  findRestaurantById(id: string): Promise<IRestaurant | null> {
    throw new NotImplementedError(`AdminRepository.findRestaurantById(${id}) is not yet implemented.`);
  }

  updateRestaurantById(id: string, data: Partial<IRestaurant>): Promise<IRestaurant | null> {
    throw new NotImplementedError(
      `AdminRepository.updateRestaurantById(${id}, ${JSON.stringify(data)}) is not yet implemented.`,
    );
  }

  findAuditLogs(
    filter: Record<string, unknown>,
    skip: number,
    limit: number,
  ): Promise<PaginatedResult<IAuditLog>> {
    throw new NotImplementedError(
      `AdminRepository.findAuditLogs(${JSON.stringify(filter)}, skip=${skip}, limit=${limit}) is not yet implemented.`,
    );
  }
}
