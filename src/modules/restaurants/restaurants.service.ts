import type { IMenu } from '@/models/Menu.model';
import type { IRestaurant } from '@/models/Restaurant.model';
import type { MenuCategoryView, MenuItemView } from '@/modules/menus/menus.types';
import type {
  CreateRestaurantDto,
  ListRestaurantsQueryDto,
  UpdateRestaurantDto,
} from '@/modules/restaurants/restaurants.dto';
import type { RestaurantsRepository } from '@/modules/restaurants/restaurants.repository';
import type { RestaurantDetailView, RestaurantListItemView } from '@/modules/restaurants/restaurants.types';
import { RestaurantStatus } from '@/types/domain.types';
import type { PaginatedResult } from '@/types/domain.types';
import { NotFoundError, NotImplementedError } from '@/utils/errors';
import { paginate } from '@/utils/pagination';

function toListItemView(restaurant: IRestaurant): RestaurantListItemView {
  return {
    id: restaurant.id as string,
    name: restaurant.name,
    cuisineTypes: restaurant.cuisineTypes,
    averageRating: restaurant.averageRating,
    ratingCount: restaurant.ratingCount,
    isVegOnly: restaurant.isVegOnly,
    minOrderValuePaise: restaurant.minOrderValuePaise,
    deliveryFeePaise: restaurant.deliveryFeePaise,
    // Working-hours-aware open/busy/closed derivation is scaffolded for a
    // later phase; any active, approved restaurant is reported as open.
    status: restaurant.isActive && restaurant.status === RestaurantStatus.APPROVED ? 'open' : 'closed',
  };
}

function toDetailView(restaurant: IRestaurant): RestaurantDetailView {
  return {
    ...toListItemView(restaurant),
    address: restaurant.address,
    logoUrl: restaurant.logoUrl,
    bannerUrl: restaurant.bannerUrl,
  };
}

function toMenuCategoryView(menu: IMenu): MenuCategoryView {
  const items: MenuItemView[] = menu.items.map((item) => ({
    id: item._id.toString(),
    name: item.name,
    description: item.description,
    photoUrl: item.photoUrl,
    pricePaise: item.pricePaise,
    dietaryTag: item.dietaryTag,
    preparationTimeMinutes: item.preparationTimeMinutes,
    isAvailable: item.isAvailable,
  }));

  return {
    id: menu.id as string,
    restaurantId: menu.restaurantId.toString(),
    categoryName: menu.categoryName,
    displayOrder: menu.displayOrder,
    isAvailable: menu.isAvailable,
    items,
  };
}

/**
 * Restaurant listing, detail, and onboarding business logic
 * (PRD 11.4, 11.16). Read paths (list/detail/menu) are implemented for the
 * passenger browse flow; organic ranking and the onboarding/approval
 * workflow remain scaffolded for a later phase.
 */
export class RestaurantsService {
  constructor(private readonly repository: RestaurantsRepository) {}

  async listRestaurants(query: ListRestaurantsQueryDto): Promise<PaginatedResult<RestaurantListItemView>> {
    const { skip, limit, page, pageSize } = paginate(query.page, query.pageSize);

    const filter: Record<string, unknown> = {
      isDeleted: false,
      isActive: true,
      status: RestaurantStatus.APPROVED,
      stationCodes: query.stationCode,
    };
    if (query.cuisine) filter.cuisineTypes = query.cuisine;
    if (query.vegOnly) filter.isVegOnly = true;

    const result = await this.repository.findMany(filter, skip, limit);

    return {
      data: result.data.map(toListItemView),
      total: result.total,
      page,
      pageSize,
      totalPages: result.totalPages,
    };
  }

  async getRestaurantDetail(id: string): Promise<RestaurantDetailView> {
    const restaurant = await this.repository.findById(id);
    if (!restaurant) {
      throw new NotFoundError('Restaurant not found.');
    }
    return toDetailView(restaurant);
  }

  async getRestaurantMenu(id: string): Promise<MenuCategoryView[]> {
    const restaurant = await this.repository.findById(id);
    if (!restaurant) {
      throw new NotFoundError('Restaurant not found.');
    }
    const menus = await this.repository.findMenusByRestaurantId(id);
    return menus.map(toMenuCategoryView);
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
