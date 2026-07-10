import type { FilterQuery } from 'mongoose';

import { Category } from '@/models/Category.model';
import { MenuItem } from '@/models/MenuItem.model';
import { Restaurant, type RestaurantDocument } from '@/models/Restaurant.model';
import { RestaurantStatus } from '@/types/domain.types';

import type { RestaurantListFilters } from './restaurants.types';

export const restaurantsRepository = {
  async list(filters: RestaurantListFilters, skip: number, limit: number, publicOnly: boolean) {
    const query: FilterQuery<RestaurantDocument> = { isDeleted: false };
    if (publicOnly) {
      query.status = RestaurantStatus.APPROVED;
      query.isActive = true;
    }
    if (filters.station) query.stationCodes = filters.station.toUpperCase();
    if (filters.cuisine) query.cuisineTypes = filters.cuisine;
    if (filters.search) query.name = { $regex: filters.search, $options: 'i' };

    const [items, total] = await Promise.all([
      Restaurant.find(query).sort({ avgRating: -1, createdAt: -1 }).skip(skip).limit(limit),
      Restaurant.countDocuments(query),
    ]);
    return { items, total };
  },

  async popular(limit: number) {
    return Restaurant.find({ isDeleted: false, status: RestaurantStatus.APPROVED, isActive: true })
      .sort({ avgRating: -1, ratingCount: -1 })
      .limit(limit);
  },

  async findById(id: string) {
    return Restaurant.findOne({ _id: id, isDeleted: false });
  },

  async findPublicById(id: string) {
    return Restaurant.findOne({ _id: id, isDeleted: false, status: RestaurantStatus.APPROVED, isActive: true });
  },

  async create(ownerUserId: string, data: Record<string, unknown>) {
    return Restaurant.create({ ...data, ownerUserId });
  },

  async update(id: string, data: Record<string, unknown>, updatedBy: string) {
    return Restaurant.findOneAndUpdate({ _id: id, isDeleted: false }, { ...data, updatedBy }, { new: true });
  },

  async setStatus(id: string, status: RestaurantStatus, extra: Record<string, unknown>, updatedBy: string) {
    return Restaurant.findOneAndUpdate({ _id: id, isDeleted: false }, { status, ...extra, updatedBy }, { new: true });
  },

  async menuForRestaurant(restaurantId: string) {
    const [categories, items] = await Promise.all([
      Category.find({ isDeleted: false, isActive: true }).sort({ displayOrder: 1 }),
      MenuItem.find({ restaurantId, isDeleted: false }).sort({ isBestseller: -1, name: 1 }),
    ]);
    return { categories, items };
  },
};
