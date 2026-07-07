import { z } from 'zod';

import { coachNumber, mongoId, seatNumber, trainNumber } from '@/validations/common.validations';

const cartCustomizationSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  additionalCharge: z.number().min(0).default(0),
});

const cartItemSchema = z.object({
  menuItemId: mongoId,
  quantity: z.number().int().min(1).max(10),
  customizations: z.array(cartCustomizationSchema).default([]),
  specialNote: z.string().max(200).optional(),
});

export const validateCartSchema = z.object({
  restaurantId: mongoId,
  items: z.array(cartItemSchema).min(1, 'Cart cannot be empty.'),
  trainNumber,
  deliveryStation: z.string().min(1),
  coach: coachNumber,
  seat: seatNumber,
  couponCode: z.string().optional(),
});
export type ValidateCartDto = z.infer<typeof validateCartSchema>;
