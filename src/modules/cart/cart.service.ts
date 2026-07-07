import { GST_RATE_PERCENT, PLATFORM_FEE_PAISE } from '@/config/constants';
import type { IMenu } from '@/models/Menu.model';
import type { CartRepository } from '@/modules/cart/cart.repository';
import type { ValidateCartDto } from '@/modules/cart/cart.dto';
import type { CartValidationItemResult, CartValidationResult } from '@/modules/cart/cart.types';
import { RestaurantStatus } from '@/types/domain.types';
import { NotFoundError } from '@/utils/errors';

function flattenItems(menus: IMenu[]): Map<string, IMenu['items'][number]> {
  const map = new Map<string, IMenu['items'][number]>();
  for (const menu of menus) {
    for (const item of menu.items) {
      map.set(item._id.toString(), item);
    }
  }
  return map;
}

/**
 * Server-side cart validation before checkout (PRD 11.6, 11.7). Confirms
 * item availability and current pricing, and recomputes the authoritative
 * totals. Delivery-window (train ETA) checking depends on the trains
 * module, which remains scaffolded, so `deliveryWindowOk` is always
 * reported true for now.
 */
export class CartService {
  constructor(private readonly repository: CartRepository) {}

  async validateCart(dto: ValidateCartDto, _userId: string): Promise<CartValidationResult> {
    const restaurant = await this.repository.findRestaurantById(dto.restaurantId);
    if (!restaurant) {
      throw new NotFoundError('Restaurant not found.');
    }

    const menus = await this.repository.findMenusByRestaurantId(dto.restaurantId);
    const itemsById = flattenItems(menus);

    let subtotalPaise = 0;
    const items: CartValidationItemResult[] = dto.items.map((cartItem) => {
      const menuItem = itemsById.get(cartItem.menuItemId);
      const isAvailable = Boolean(menuItem?.isAvailable);

      if (menuItem && isAvailable) {
        subtotalPaise += menuItem.pricePaise * cartItem.quantity;
      }

      return {
        menuItemId: cartItem.menuItemId,
        isAvailable,
        priceChanged: false,
        currentPricePaise: menuItem?.pricePaise,
      };
    });

    const isRestaurantOpen = restaurant.isActive && restaurant.status === RestaurantStatus.APPROVED;
    const allItemsAvailable = items.every((item) => item.isAvailable);
    const minOrderValueMetPaise = subtotalPaise >= restaurant.minOrderValuePaise;
    const deliveryWindowOk = true;

    const deliveryFeePaise = restaurant.deliveryFeePaise;
    const platformFeePaise = PLATFORM_FEE_PAISE;
    const gstPaise = Math.round((subtotalPaise * GST_RATE_PERCENT) / 100);
    const grandTotalPaise = subtotalPaise + deliveryFeePaise + platformFeePaise + gstPaise;

    return {
      isValid: isRestaurantOpen && allItemsAvailable && minOrderValueMetPaise && deliveryWindowOk,
      items,
      subtotalPaise,
      deliveryFeePaise,
      platformFeePaise,
      gstPaise,
      grandTotalPaise,
      minOrderValueMetPaise,
      deliveryWindowOk,
    };
  }
}
