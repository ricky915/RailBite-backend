import type { Request, Response } from 'express';

import type {
  CreateRatingDto,
  ListRatingsQueryDto,
  RatingIdParamsDto,
  RestaurantIdParamsDto,
  UpdateRatingDto,
} from '@/modules/ratings/ratings.dto';
import type { RatingsService } from '@/modules/ratings/ratings.service';
import { AuthenticationError } from '@/utils/errors';
import { successResponse } from '@/utils/responseFormatter';

function requireUserId(req: Request): string {
  if (!req.user) {
    throw new AuthenticationError('Please log in to continue.');
  }
  return req.user.userId;
}

export class RatingsController {
  constructor(private readonly service: RatingsService) {}

  submit = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as CreateRatingDto;
    const result = await this.service.submitRating(dto, requireUserId(req));
    successResponse(res, result, 'Rating submitted successfully.', 201);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as RatingIdParamsDto;
    const dto = req.body as UpdateRatingDto;
    const result = await this.service.updateRating(id, dto, requireUserId(req));
    successResponse(res, result, 'Rating updated successfully.');
  };

  listByRestaurant = async (req: Request, res: Response): Promise<void> => {
    const { restaurantId } = req.params as unknown as RestaurantIdParamsDto;
    const query = req.query as unknown as ListRatingsQueryDto;
    const result = await this.service.listByRestaurant(restaurantId, query);
    successResponse(res, result, 'Reviews retrieved successfully.');
  };
}
