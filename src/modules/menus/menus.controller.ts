import type { Request, Response } from 'express';

import type {
  CreateMenuCategoryDto,
  CreateMenuItemDto,
  MenuIdParamsDto,
  MenuItemParamsDto,
  ToggleItemAvailabilityDto,
  UpdateMenuCategoryDto,
  UpdateMenuItemDto,
} from '@/modules/menus/menus.dto';
import type { MenusService } from '@/modules/menus/menus.service';
import { AuthenticationError } from '@/utils/errors';
import { successResponse } from '@/utils/responseFormatter';

function requireUserId(req: Request): string {
  if (!req.user) {
    throw new AuthenticationError('Please log in to continue.');
  }
  return req.user.userId;
}

export class MenusController {
  constructor(private readonly service: MenusService) {}

  createCategory = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as CreateMenuCategoryDto;
    const result = await this.service.createCategory(dto, requireUserId(req));
    successResponse(res, result, 'Menu category created successfully.', 201);
  };

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as MenuIdParamsDto;
    const dto = req.body as UpdateMenuCategoryDto;
    const result = await this.service.updateCategory(id, dto, requireUserId(req));
    successResponse(res, result, 'Menu category updated successfully.');
  };

  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as MenuIdParamsDto;
    await this.service.deleteCategory(id, requireUserId(req));
    successResponse(res, null, 'Menu category deleted successfully.');
  };

  addItem = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as MenuIdParamsDto;
    const dto = req.body as CreateMenuItemDto;
    const result = await this.service.addItem(id, dto, requireUserId(req));
    successResponse(res, result, 'Menu item added successfully.', 201);
  };

  updateItem = async (req: Request, res: Response): Promise<void> => {
    const { id, itemId } = req.params as unknown as MenuItemParamsDto;
    const dto = req.body as UpdateMenuItemDto;
    const result = await this.service.updateItem(id, itemId, dto, requireUserId(req));
    successResponse(res, result, 'Menu item updated successfully.');
  };

  removeItem = async (req: Request, res: Response): Promise<void> => {
    const { id, itemId } = req.params as unknown as MenuItemParamsDto;
    await this.service.removeItem(id, itemId, requireUserId(req));
    successResponse(res, null, 'Menu item removed successfully.');
  };

  toggleAvailability = async (req: Request, res: Response): Promise<void> => {
    const { id, itemId } = req.params as unknown as MenuItemParamsDto;
    const dto = req.body as ToggleItemAvailabilityDto;
    const result = await this.service.toggleItemAvailability(id, itemId, dto, requireUserId(req));
    successResponse(res, result, 'Menu item availability updated successfully.');
  };
}
