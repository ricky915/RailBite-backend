import type { FilterQuery } from 'mongoose';

import type { IMenu } from '@/models/Menu.model';
import { MenuModel } from '@/models/Menu.model';
import type { IOrder } from '@/models/Order.model';
import { OrderModel } from '@/models/Order.model';
import type { IRestaurant } from '@/models/Restaurant.model';
import { RestaurantModel } from '@/models/Restaurant.model';
import type { PaginatedResult } from '@/types/domain.types';

/**
 * Data access for the orders module (TRD 3.2.4, 5.3, `orders` collection).
 * Also exposes the read-only restaurant/menu lookups `placeOrder` needs for
 * server-side price/availability re-validation at order time (mirrors the
 * same read-only pattern used by `cart.repository.ts`).
 */
export class OrdersRepository {
  findById(id: string): Promise<IOrder | null> {
    return OrderModel.findOne({ _id: id, isDeleted: false });
  }

  findRestaurantById(id: string): Promise<IRestaurant | null> {
    return RestaurantModel.findOne({ _id: id, isDeleted: false });
  }

  findMenusByRestaurantId(restaurantId: string): Promise<IMenu[]> {
    return MenuModel.find({ restaurantId, isDeleted: false });
  }

  findByOrderId(orderId: string): Promise<IOrder | null> {
    return OrderModel.findOne({ orderId, isDeleted: false });
  }

  findByIdempotencyKey(idempotencyKey: string): Promise<IOrder | null> {
    return OrderModel.findOne({ idempotencyKey });
  }

  async findMany(
    filter: FilterQuery<IOrder>,
    skip: number,
    limit: number,
  ): Promise<PaginatedResult<IOrder>> {
    const [data, total] = await Promise.all([
      OrderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      OrderModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page: Math.floor(skip / limit) + 1,
      pageSize: limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  create(data: Partial<IOrder>): Promise<IOrder> {
    return OrderModel.create(data);
  }

  async updateById(id: string, data: Partial<IOrder>): Promise<IOrder | null> {
    return OrderModel.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true });
  }

  countAll(): Promise<number> {
    return OrderModel.countDocuments({});
  }
}
