import type {
  CreateMenuCategoryDto,
  CreateMenuItemDto,
  ToggleItemAvailabilityDto,
  UpdateMenuCategoryDto,
  UpdateMenuItemDto,
} from '@/modules/menus/menus.dto';
import type { MenusRepository } from '@/modules/menus/menus.repository';
import type { MenuCategoryView } from '@/modules/menus/menus.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Menu category/item management business logic (PRD 11.5, 11.16).
 * Scaffold: real-time price recalculation, availability toggling, and
 * ownership checks are planned for a later phase.
 */
export class MenusService {
  constructor(private readonly repository: MenusRepository) {}

  createCategory(dto: CreateMenuCategoryDto, actorUserId: string): Promise<MenuCategoryView> {
    throw new NotImplementedError(
      `MenusService.createCategory(actor=${actorUserId}, ${JSON.stringify(dto)}) is not yet implemented.`,
    );
  }

  updateCategory(id: string, dto: UpdateMenuCategoryDto, actorUserId: string): Promise<MenuCategoryView> {
    throw new NotImplementedError(
      `MenusService.updateCategory(${id}, actor=${actorUserId}, ${JSON.stringify(dto)}) is not yet implemented.`,
    );
  }

  deleteCategory(id: string, actorUserId: string): Promise<void> {
    throw new NotImplementedError(
      `MenusService.deleteCategory(${id}, actor=${actorUserId}) is not yet implemented.`,
    );
  }

  addItem(menuId: string, dto: CreateMenuItemDto, actorUserId: string): Promise<MenuCategoryView> {
    throw new NotImplementedError(
      `MenusService.addItem(${menuId}, actor=${actorUserId}, ${JSON.stringify(dto)}) is not yet implemented.`,
    );
  }

  updateItem(
    menuId: string,
    itemId: string,
    dto: UpdateMenuItemDto,
    actorUserId: string,
  ): Promise<MenuCategoryView> {
    throw new NotImplementedError(
      `MenusService.updateItem(${menuId}, ${itemId}, actor=${actorUserId}, ${JSON.stringify(dto)}) is not yet implemented.`,
    );
  }

  removeItem(menuId: string, itemId: string, actorUserId: string): Promise<void> {
    throw new NotImplementedError(
      `MenusService.removeItem(${menuId}, ${itemId}, actor=${actorUserId}) is not yet implemented.`,
    );
  }

  toggleItemAvailability(
    menuId: string,
    itemId: string,
    dto: ToggleItemAvailabilityDto,
    actorUserId: string,
  ): Promise<MenuCategoryView> {
    throw new NotImplementedError(
      `MenusService.toggleItemAvailability(${menuId}, ${itemId}, isAvailable=${dto.isAvailable}, actor=${actorUserId}) is not yet implemented.`,
    );
  }
}
