import { z } from 'zod';

import { mongoId } from '@/validations/common.validations';

export const createMenuCategorySchema = z.object({
  restaurantId: mongoId,
  categoryName: z.string().min(1).max(50),
  displayOrder: z.number().int().min(0).default(0),
});
export type CreateMenuCategoryDto = z.infer<typeof createMenuCategorySchema>;

export const updateMenuCategorySchema = z.object({
  categoryName: z.string().min(1).max(50).optional(),
  displayOrder: z.number().int().min(0).optional(),
  isAvailable: z.boolean().optional(),
  unavailableReason: z.string().max(200).optional(),
});
export type UpdateMenuCategoryDto = z.infer<typeof updateMenuCategorySchema>;

export const menuIdParamsSchema = z.object({ id: mongoId });
export type MenuIdParamsDto = z.infer<typeof menuIdParamsSchema>;

export const menuItemParamsSchema = z.object({ id: mongoId, itemId: mongoId });
export type MenuItemParamsDto = z.infer<typeof menuItemParamsSchema>;

export const createMenuItemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  pricePaise: z.number().int().positive(),
  dietaryTag: z.enum(['veg', 'non_veg', 'vegan', 'egg']),
  preparationTimeMinutes: z.number().int().min(0).default(15),
  customizationGroups: z
    .array(
      z.object({
        name: z.string().min(1),
        required: z.boolean().default(false),
        options: z.array(
          z.object({
            label: z.string().min(1),
            additionalChargePaise: z.number().int().min(0).default(0),
          }),
        ),
      }),
    )
    .default([]),
});
export type CreateMenuItemDto = z.infer<typeof createMenuItemSchema>;

export const updateMenuItemSchema = createMenuItemSchema.partial();
export type UpdateMenuItemDto = z.infer<typeof updateMenuItemSchema>;

export const toggleItemAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});
export type ToggleItemAvailabilityDto = z.infer<typeof toggleItemAvailabilitySchema>;
