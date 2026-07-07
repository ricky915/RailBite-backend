import type { IOrder } from '@/models/Order.model';
import type { PaginatedResult } from '@/types/domain.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Data access for the orders module (TRD 3.2.4, 5.3, `orders` collection).
 * Scaffold: order placement, listing, and status-transition persistence
 * are planned for a later phase.
 */
export class OrdersRepository {
  findById(id: string): Promise<IOrder | null> {
    throw new NotImplementedError(`OrdersRepository.findById(${id}) is not yet implemented.`);
  }

  findByOrderId(orderId: string): Promise<IOrder | null> {
    throw new NotImplementedError(`OrdersRepository.findByOrderId(${orderId}) is not yet implemented.`);
  }

  findByIdempotencyKey(idempotencyKey: string): Promise<IOrder | null> {
    throw new NotImplementedError(
      `OrdersRepository.findByIdempotencyKey(${idempotencyKey}) is not yet implemented.`,
    );
  }

  findMany(filter: Record<string, unknown>, skip: number, limit: number): Promise<PaginatedResult<IOrder>> {
    throw new NotImplementedError(
      `OrdersRepository.findMany(${JSON.stringify(filter)}, skip=${skip}, limit=${limit}) is not yet implemented.`,
    );
  }

  create(data: Partial<IOrder>): Promise<IOrder> {
    throw new NotImplementedError(`OrdersRepository.create(${JSON.stringify(data)}) is not yet implemented.`);
  }

  updateById(id: string, data: Partial<IOrder>): Promise<IOrder | null> {
    throw new NotImplementedError(
      `OrdersRepository.updateById(${id}, ${JSON.stringify(data)}) is not yet implemented.`,
    );
  }
}
