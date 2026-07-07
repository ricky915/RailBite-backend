import type { IMenu } from '@/models/Menu.model';
import { MenuModel } from '@/models/Menu.model';
import type { IRestaurant } from '@/models/Restaurant.model';
import { RestaurantModel } from '@/models/Restaurant.model';

/**
 * Cart has no dedicated collection (TRD 12.1) — it is a client-side
 * concept; the server only validates it. This repository exposes the
 * read-only lookups the validation service needs.
 */
export class CartRepository {
  findRestaurantById(id: string): Promise<IRestaurant | null> {
    return RestaurantModel.findOne({ _id: id, isDeleted: false });
  }

  findMenusByRestaurantId(restaurantId: string): Promise<IMenu[]> {
    return MenuModel.find({ restaurantId, isDeleted: false });
  }
}
