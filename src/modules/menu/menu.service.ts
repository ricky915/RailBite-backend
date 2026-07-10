import { Restaurant } from '@/models/Restaurant.model';
import { UserRole } from '@/types/domain.types';
import { ForbiddenError, NotFoundError } from '@/utils/errors';

import type {
  CreateCategoryInput,
  CreateMenuItemInput,
  SetAvailabilityInput,
  UpdateCategoryInput,
  UpdateMenuItemInput,
} from './menu.dto';
import { menuRepository } from './menu.repository';

async function assertRestaurantOwnership(restaurantId: string, user: { id: string; role: UserRole }): Promise<void> {
  if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) return;
  const restaurant = await Restaurant.findOne({ _id: restaurantId, isDeleted: false });
  if (!restaurant) throw new NotFoundError('Restaurant not found');
  if (restaurant.ownerUserId.toString() !== user.id) {
    throw new ForbiddenError('You do not manage this restaurant');
  }
}

async function assertMenuItemOwnership(itemId: string, user: { id: string; role: UserRole }) {
  const item = await menuRepository.findItemById(itemId);
  if (!item) throw new NotFoundError('Menu item not found');
  await assertRestaurantOwnership(item.restaurantId.toString(), user);
  return item;
}

export const menuService = {
  async listCategories(includeInactive: boolean) {
    return menuRepository.listCategories(includeInactive);
  },

  async createCategory(input: CreateCategoryInput) {
    return menuRepository.createCategory(input);
  },

  async updateCategory(id: string, input: UpdateCategoryInput) {
    const category = await menuRepository.updateCategory(id, input);
    if (!category) throw new NotFoundError('Category not found');
    return category;
  },

  async deleteCategory(id: string) {
    const category = await menuRepository.softDeleteCategory(id);
    if (!category) throw new NotFoundError('Category not found');
    return category;
  },

  async popularItems(limit = 10) {
    return menuRepository.popularItems(limit);
  },

  async getItem(id: string) {
    const item = await menuRepository.findPublicItemById(id);
    if (!item) throw new NotFoundError('Menu item not found');
    return item;
  },

  async createItem(input: CreateMenuItemInput, user: { id: string; role: UserRole }) {
    await assertRestaurantOwnership(input.restaurantId, user);
    return menuRepository.createItem(input);
  },

  async updateItem(id: string, input: UpdateMenuItemInput, user: { id: string; role: UserRole }) {
    await assertMenuItemOwnership(id, user);
    const item = await menuRepository.updateItem(id, input, user.id);
    if (!item) throw new NotFoundError('Menu item not found');
    return item;
  },

  async setAvailability(id: string, input: SetAvailabilityInput, user: { id: string; role: UserRole }) {
    await assertMenuItemOwnership(id, user);
    const item = await menuRepository.updateItem(id, { isAvailable: input.isAvailable }, user.id);
    if (!item) throw new NotFoundError('Menu item not found');
    return item;
  },

  async deleteItem(id: string, user: { id: string; role: UserRole }) {
    await assertMenuItemOwnership(id, user);
    const item = await menuRepository.softDeleteItem(id, user.id);
    if (!item) throw new NotFoundError('Menu item not found');
    return item;
  },
};
