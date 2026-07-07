import type { Request, Response } from 'express';

import type {
  CreateRestaurantDto,
  ListRestaurantsQueryDto,
  RestaurantIdParamsDto,
  UpdateRestaurantDto,
} from '@/modules/restaurants/restaurants.dto';
import type { RestaurantsService } from '@/modules/restaurants/restaurants.service';
import { AuthenticationError } from '@/utils/errors';
import { successResponse } from '@/utils/responseFormatter';

function requireUserId(req: Request): string {
  if (!req.user) {
    throw new AuthenticationError('Please log in to continue.');
  }
  return req.user.userId;
}

export class RestaurantsController {
  constructor(private readonly service: RestaurantsService) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as ListRestaurantsQueryDto;
    const result = await this.service.listRestaurants(query);
    successResponse(res, result, 'Restaurants retrieved successfully.');
  };

  getDetail = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as RestaurantIdParamsDto;
    const result = await this.service.getRestaurantDetail(id);
    successResponse(res, result, 'Restaurant detail retrieved successfully.');
  };

  getMenu = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as RestaurantIdParamsDto;
    const result = await this.service.getRestaurantMenu(id);
    successResponse(res, result, 'Restaurant menu retrieved successfully.');
  };

  submitOnboarding = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as CreateRestaurantDto;
    const result = await this.service.submitOnboarding(dto, requireUserId(req));
    successResponse(res, result, 'Restaurant onboarding submitted for review.', 201);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as RestaurantIdParamsDto;
    const dto = req.body as UpdateRestaurantDto;
    const result = await this.service.updateRestaurant(id, dto, requireUserId(req));
    successResponse(res, result, 'Restaurant updated successfully.');
  };

  disable = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as RestaurantIdParamsDto;
    await this.service.disableRestaurant(id, requireUserId(req));
    successResponse(res, null, 'Restaurant disabled successfully.');
  };
}
