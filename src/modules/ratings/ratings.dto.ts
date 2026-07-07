import { z } from 'zod';

import { mongoId, paginationQuery } from '@/validations/common.validations';

export const createRatingSchema = z.object({
  orderId: mongoId,
  stars: z.number().int().min(1).max(5),
  reviewText: z.string().max(500).optional(),
  photoUrls: z.array(z.string().url()).max(3).default([]),
});
export type CreateRatingDto = z.infer<typeof createRatingSchema>;

export const updateRatingSchema = z.object({
  stars: z.number().int().min(1).max(5).optional(),
  reviewText: z.string().max(500).optional(),
  photoUrls: z.array(z.string().url()).max(3).optional(),
});
export type UpdateRatingDto = z.infer<typeof updateRatingSchema>;

export const ratingIdParamsSchema = z.object({ id: mongoId });
export type RatingIdParamsDto = z.infer<typeof ratingIdParamsSchema>;

export const restaurantIdParamsSchema = z.object({ restaurantId: mongoId });
export type RestaurantIdParamsDto = z.infer<typeof restaurantIdParamsSchema>;

export const listRatingsQuerySchema = paginationQuery.extend({
  minStars: z.coerce.number().int().min(1).max(5).optional(),
});
export type ListRatingsQueryDto = z.infer<typeof listRatingsQuerySchema>;
