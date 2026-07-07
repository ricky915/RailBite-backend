import { z } from 'zod';

import { isoDateString, mongoId, paginationQuery } from '@/validations/common.validations';

export const listRestaurantsQuerySchema = paginationQuery.extend({
  stationCode: z.string().min(1, 'Please select a delivery station.'),
  date: isoDateString.optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  cuisine: z.string().optional(),
  vegOnly: z.coerce.boolean().optional(),
  minRating: z.coerce.number().min(1).max(5).optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
});
export type ListRestaurantsQueryDto = z.infer<typeof listRestaurantsQuerySchema>;

export const restaurantIdParamsSchema = z.object({ id: mongoId });
export type RestaurantIdParamsDto = z.infer<typeof restaurantIdParamsSchema>;

export const createRestaurantSchema = z.object({
  name: z.string().min(2).max(100),
  fssaiLicenseNumber: z.string().regex(/^\d{14}$/, 'FSSAI license must be 14 digits.'),
  fssaiExpiryDate: isoDateString,
  gstin: z.string().regex(/^[0-9A-Z]{15}$/, 'Please enter a valid 15-character GSTIN.'),
  bankDetails: z.object({
    accountHolderName: z.string().min(2),
    accountNumber: z.string().regex(/^\d{9,18}$/, 'Account number must be 9-18 digits.'),
    ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code.'),
  }),
  address: z.object({
    line1: z.string().min(2),
    line2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().regex(/^\d{6}$/),
  }),
  stationCodes: z.array(z.string().min(1)).min(1, 'At least one station is required.'),
  cuisineTypes: z.array(z.string()).min(1),
  isVegOnly: z.boolean().default(false),
  minOrderValuePaise: z.number().int().min(0).max(99900),
  deliveryFeePaise: z.number().int().min(0),
  isCodEnabled: z.boolean().default(false),
});
export type CreateRestaurantDto = z.infer<typeof createRestaurantSchema>;

export const updateRestaurantSchema = createRestaurantSchema.partial();
export type UpdateRestaurantDto = z.infer<typeof updateRestaurantSchema>;

export const approveRestaurantSchema = z.object({
  comments: z.string().max(500).optional(),
});
export type ApproveRestaurantDto = z.infer<typeof approveRestaurantSchema>;

export const suspendRestaurantSchema = z.object({
  reason: z.string().min(5).max(500),
});
export type SuspendRestaurantDto = z.infer<typeof suspendRestaurantSchema>;
