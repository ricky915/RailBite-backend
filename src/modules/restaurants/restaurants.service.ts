import { RestaurantStatus, UserRole } from '@/types/domain.types';
import { ForbiddenError, NotFoundError } from '@/utils/errors';
import { buildPaginationMeta } from '@/utils/responseFormatter';

import type { CreateRestaurantInput, ListRestaurantsInput, RejectOrSuspendRestaurantInput, UpdateRestaurantInput } from './restaurants.dto';
import { restaurantsRepository } from './restaurants.repository';

function assertOwnerOrAdmin(
  restaurant: { ownerUserId: { toString(): string } },
  user: { id: string; role: UserRole },
): void {
  const isOwner = restaurant.ownerUserId.toString() === user.id;
  const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
  if (!isOwner && !isAdmin) throw new ForbiddenError('You do not have access to this restaurant');
}

export const restaurantsService = {
  async list(input: ListRestaurantsInput, isAdminCaller: boolean) {
    const page = input.page ?? 1;
    const limit = Math.min(100, input.limit ?? 20);
    const { items, total } = await restaurantsRepository.list(
      { station: input.station, cuisine: input.cuisine, search: input.search },
      (page - 1) * limit,
      limit,
      !isAdminCaller,
    );
    return { items, meta: buildPaginationMeta(page, limit, total) };
  },

  async popular(limit = 10) {
    return restaurantsRepository.popular(limit);
  },

  async getPublicDetail(id: string) {
    const restaurant = await restaurantsRepository.findPublicById(id);
    if (!restaurant) throw new NotFoundError('Restaurant not found');
    return restaurant;
  },

  async getMenu(id: string) {
    const restaurant = await restaurantsRepository.findPublicById(id);
    if (!restaurant) throw new NotFoundError('Restaurant not found');
    return restaurantsRepository.menuForRestaurant(id);
  },

  async create(ownerUserId: string, input: CreateRestaurantInput) {
    return restaurantsRepository.create(ownerUserId, input);
  },

  async update(id: string, input: UpdateRestaurantInput, user: { id: string; role: UserRole }) {
    const restaurant = await restaurantsRepository.findById(id);
    if (!restaurant) throw new NotFoundError('Restaurant not found');
    assertOwnerOrAdmin(restaurant, user);
    return restaurantsRepository.update(id, input, user.id);
  },

  async approve(id: string, adminId: string) {
    const restaurant = await restaurantsRepository.findById(id);
    if (!restaurant) throw new NotFoundError('Restaurant not found');
    return restaurantsRepository.setStatus(id, RestaurantStatus.APPROVED, { approvedAt: new Date(), approvedBy: adminId }, adminId);
  },

  async reject(id: string, input: RejectOrSuspendRestaurantInput, adminId: string) {
    const restaurant = await restaurantsRepository.findById(id);
    if (!restaurant) throw new NotFoundError('Restaurant not found');
    return restaurantsRepository.setStatus(id, RestaurantStatus.REJECTED, { rejectionReason: input.reason }, adminId);
  },

  async suspend(id: string, input: RejectOrSuspendRestaurantInput, adminId: string) {
    const restaurant = await restaurantsRepository.findById(id);
    if (!restaurant) throw new NotFoundError('Restaurant not found');
    return restaurantsRepository.setStatus(id, RestaurantStatus.SUSPENDED, { rejectionReason: input.reason, isActive: false }, adminId);
  },
};
