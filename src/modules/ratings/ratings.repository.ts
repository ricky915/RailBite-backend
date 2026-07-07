import type { IRating } from '@/models/Rating.model';
import type { PaginatedResult } from '@/types/domain.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Data access for the ratings module (TRD 3.2.4, 5.3, `ratings`
 * collection). Scaffold: eligibility checks (delivered-order-only),
 * weighted average recalculation, and content-moderation flags are
 * planned for a later phase.
 */
export class RatingsRepository {
  findByOrderId(orderId: string): Promise<IRating | null> {
    throw new NotImplementedError(`RatingsRepository.findByOrderId(${orderId}) is not yet implemented.`);
  }

  findById(id: string): Promise<IRating | null> {
    throw new NotImplementedError(`RatingsRepository.findById(${id}) is not yet implemented.`);
  }

  findByRestaurantId(
    restaurantId: string,
    skip: number,
    limit: number,
  ): Promise<PaginatedResult<IRating>> {
    throw new NotImplementedError(
      `RatingsRepository.findByRestaurantId(${restaurantId}, skip=${skip}, limit=${limit}) is not yet implemented.`,
    );
  }

  create(data: Partial<IRating>): Promise<IRating> {
    throw new NotImplementedError(`RatingsRepository.create(${JSON.stringify(data)}) is not yet implemented.`);
  }

  updateById(id: string, data: Partial<IRating>): Promise<IRating | null> {
    throw new NotImplementedError(
      `RatingsRepository.updateById(${id}, ${JSON.stringify(data)}) is not yet implemented.`,
    );
  }
}
