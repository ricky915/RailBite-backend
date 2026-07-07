import type { CartRepository } from '@/modules/cart/cart.repository';
import type { ValidateCartDto } from '@/modules/cart/cart.dto';
import type { CartValidationResult } from '@/modules/cart/cart.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Server-side cart validation before checkout (PRD 11.6, 11.7). Confirms
 * item availability, current pricing, minimum order value, single-
 * restaurant constraint, and the 45-minute delivery window (TRD 17.5).
 * Scaffold: business-rule validation is planned for a later phase.
 */
export class CartService {
  constructor(private readonly repository: CartRepository) {}

  validateCart(dto: ValidateCartDto, userId: string): Promise<CartValidationResult> {
    throw new NotImplementedError(
      `CartService.validateCart(restaurant=${dto.restaurantId}, user=${userId}, items=${dto.items.length}) is not yet implemented.`,
    );
  }
}
