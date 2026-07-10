import { z } from 'zod';

export const listRestaurantsSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  station: z.string().trim().optional(),
  cuisine: z.string().trim().optional(),
  search: z.string().trim().max(100).optional(),
});
export type ListRestaurantsInput = z.infer<typeof listRestaurantsSchema>;

export const restaurantIdParamSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i, 'Invalid restaurant id'),
});

export const createRestaurantSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).optional(),
  cuisineTypes: z.array(z.string().trim()).default([]),
  logoUrl: z.string().url().optional(),
  coverImageUrl: z.string().url().optional(),
  stationCodes: z.array(z.string().trim().toUpperCase()).min(1, 'At least one serving station is required'),
  address: z.string().trim().min(5).max(300),
  contactPhone: z.string().trim().regex(/^[6-9]\d{9}$/),
  contactEmail: z.string().trim().toLowerCase().email(),
  minOrderValuePaise: z.number().int().min(0).optional(),
  codEligible: z.boolean().optional(),
});
export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;

export const updateRestaurantSchema = createRestaurantSchema.partial().extend({
  isActive: z.boolean().optional(),
});
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;

export const rejectOrSuspendRestaurantSchema = z.object({
  reason: z.string().trim().min(3).max(500),
});
export type RejectOrSuspendRestaurantInput = z.infer<typeof rejectOrSuspendRestaurantSchema>;
