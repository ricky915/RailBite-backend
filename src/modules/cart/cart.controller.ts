import type { Request, Response } from 'express';

import type { ValidateCartDto } from '@/modules/cart/cart.dto';
import type { CartService } from '@/modules/cart/cart.service';
import { AuthenticationError } from '@/utils/errors';
import { successResponse } from '@/utils/responseFormatter';

export class CartController {
  constructor(private readonly service: CartService) {}

  validate = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AuthenticationError('Please log in to continue.');
    }
    const dto = req.body as ValidateCartDto;
    const result = await this.service.validateCart(dto, req.user.userId);
    successResponse(res, result, 'Cart validated successfully.');
  };
}
