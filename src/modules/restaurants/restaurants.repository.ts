import type { FilterQuery } from 'mongoose';

import type { IMenu } from '@/models/Menu.model';
import { MenuModel } from '@/models/Menu.model';
import type { IRestaurant } from '@/models/Restaurant.model';
import { RestaurantModel } from '@/models/Restaurant.model';
import type { PaginatedResult } from '@/types/domain.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Data access for the restaurants module (TRD 3.2.4, 5.3). Read paths
 * (list/detail, used by the passenger-facing browse flow) are implemented;
 * onboarding/update persistence remains scaffolded for a later phase.
 */
export class RestaurantsRepository {
  findById(id: string): Promise<IRestaurant | null> {
    return RestaurantModel.findOne({ _id: id, isDeleted: false });
  }

  findMenusByRestaurantId(restaurantId: string): Promise<IMenu[]> {
    return MenuModel.find({ restaurantId, isDeleted: false }).sort({ displayOrder: 1 });
  }

  async findMany(
    filter: FilterQuery<IRestaurant>,
    skip: number,
    limit: number,
  ): Promise<PaginatedResult<IRestaurant>> {
    const [data, total] = await Promise.all([
      RestaurantModel.find(filter).skip(skip).limit(limit).sort({ averageRating: -1 }),
      RestaurantModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page: Math.floor(skip / limit) + 1,
      pageSize: limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  create(data: Partial<IRestaurant>): Promise<IRestaurant> {
    throw new NotImplementedError(
      `RestaurantsRepository.create(${JSON.stringify(data)}) is not yet implemented.`,
    );
  }

  updateById(id: string, data: Partial<IRestaurant>): Promise<IRestaurant | null> {
    throw new NotImplementedError(
      `RestaurantsRepository.updateById(${id}, ${JSON.stringify(data)}) is not yet implemented.`,
    );
  }
}
