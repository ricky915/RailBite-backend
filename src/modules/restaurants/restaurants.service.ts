import type {
  CreateRestaurantDto,
  ListRestaurantsQueryDto,
  UpdateRestaurantDto,
} from '@/modules/restaurants/restaurants.dto';
import type { RestaurantsRepository } from '@/modules/restaurants/restaurants.repository';
import type { RestaurantDetailView, RestaurantListItemView } from '@/modules/restaurants/restaurants.types';
import type { PaginatedResult } from '@/types/domain.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Restaurant listing, detail, and onboarding business logic
 * (PRD 11.4, 11.16). Scaffold: delivery-window filtering, organic
 * ranking, and the approval workflow are planned for a later phase.
 */
export class RestaurantsService {
  constructor(private readonly repository: RestaurantsRepository) {}

  listRestaurants(query: ListRestaurantsQueryDto): Promise<PaginatedResult<RestaurantListItemView>> {
    throw new NotImplementedError(
      `RestaurantsService.listRestaurants(${JSON.stringify(query)}) is not yet implemented.`,
    );
  }

  getRestaurantDetail(id: string): Promise<RestaurantDetailView> {
    throw new NotImplementedError(`RestaurantsService.getRestaurantDetail(${id}) is not yet implemented.`);
  }

  getRestaurantMenu(id: string): Promise<unknown> {
    throw new NotImplementedError(`RestaurantsService.getRestaurantMenu(${id}) is not yet implemented.`);
  }

  submitOnboarding(dto: CreateRestaurantDto, ownerUserId: string): Promise<RestaurantDetailView> {
    throw new NotImplementedError(
      `RestaurantsService.submitOnboarding(owner=${ownerUserId}, name=${dto.name}) is not yet implemented.`,
    );
  }

  updateRestaurant(id: string, dto: UpdateRestaurantDto, actorUserId: string): Promise<RestaurantDetailView> {
    throw new NotImplementedError(
      `RestaurantsService.updateRestaurant(${id}, actor=${actorUserId}, ${JSON.stringify(dto)}) is not yet implemented.`,
    );
  }

  disableRestaurant(id: string, actorUserId: string): Promise<void> {
    throw new NotImplementedError(
      `RestaurantsService.disableRestaurant(${id}, actor=${actorUserId}) is not yet implemented.`,
    );
  }
}
