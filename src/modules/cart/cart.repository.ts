import type { IMenu } from '@/models/Menu.model';
import type { IRestaurant } from '@/models/Restaurant.model';
import { NotImplementedError } from '@/utils/errors';

/**
 * Cart has no dedicated collection (TRD 12.1) — it is a client-side
 * (Zustand) concept; the server only validates it. This repository
 * exposes the read-only lookups the validation service needs.
 * Scaffold: lookups are planned for a later phase.
 */
export class CartRepository {
  findRestaurantById(id: string): Promise<IRestaurant | null> {
    throw new NotImplementedError(`CartRepository.findRestaurantById(${id}) is not yet implemented.`);
  }

  findMenusByRestaurantId(restaurantId: string): Promise<IMenu[]> {
    throw new NotImplementedError(
      `CartRepository.findMenusByRestaurantId(${restaurantId}) is not yet implemented.`,
    );
  }
}
