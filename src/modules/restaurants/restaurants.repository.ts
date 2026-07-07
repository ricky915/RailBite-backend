import type { IRestaurant } from '@/models/Restaurant.model';
import type { PaginatedResult } from '@/types/domain.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Data access for the restaurants module (TRD 3.2.4, 5.3). Scaffold:
 * station/time-window-aware listing queries and approval workflow
 * persistence are planned for a later phase.
 */
export class RestaurantsRepository {
  findById(id: string): Promise<IRestaurant | null> {
    throw new NotImplementedError(`RestaurantsRepository.findById(${id}) is not yet implemented.`);
  }

  findMany(
    filter: Record<string, unknown>,
    skip: number,
    limit: number,
  ): Promise<PaginatedResult<IRestaurant>> {
    throw new NotImplementedError(
      `RestaurantsRepository.findMany(${JSON.stringify(filter)}, skip=${skip}, limit=${limit}) is not yet implemented.`,
    );
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
