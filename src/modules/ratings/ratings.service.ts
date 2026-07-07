import type {
  CreateRatingDto,
  ListRatingsQueryDto,
  UpdateRatingDto,
} from '@/modules/ratings/ratings.dto';
import type { RatingsRepository } from '@/modules/ratings/ratings.repository';
import type { RatingView } from '@/modules/ratings/ratings.types';
import type { PaginatedResult } from '@/types/domain.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Ratings and reviews business logic (PRD 11.12, 13.10). Scaffold: the
 * delivered-order eligibility check, 7-day rating window, 48-hour edit
 * window, and weighted average recalculation are planned for a later
 * phase.
 */
export class RatingsService {
  constructor(private readonly repository: RatingsRepository) {}

  submitRating(dto: CreateRatingDto, userId: string): Promise<RatingView> {
    throw new NotImplementedError(
      `RatingsService.submitRating(order=${dto.orderId}, user=${userId}, stars=${dto.stars}) is not yet implemented.`,
    );
  }

  updateRating(id: string, dto: UpdateRatingDto, userId: string): Promise<RatingView> {
    throw new NotImplementedError(
      `RatingsService.updateRating(${id}, user=${userId}, ${JSON.stringify(dto)}) is not yet implemented.`,
    );
  }

  listByRestaurant(
    restaurantId: string,
    query: ListRatingsQueryDto,
  ): Promise<PaginatedResult<RatingView>> {
    throw new NotImplementedError(
      `RatingsService.listByRestaurant(${restaurantId}, ${JSON.stringify(query)}) is not yet implemented.`,
    );
  }
}
