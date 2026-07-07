import { z } from 'zod';

import { OrderStatus, PaymentMode } from '@/types/domain.types';
import {
  coachNumber,
  dateRangeQuery,
  mongoId,
  paginationQuery,
  pnr,
  seatNumber,
  trainNumber,
} from '@/validations/common.validations';

const orderCustomizationSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  additionalCharge: z.number().min(0).default(0),
});

const orderItemSchema = z.object({
  menuItemId: mongoId,
  quantity: z.number().int().min(1).max(10),
  customizations: z.array(orderCustomizationSchema).default([]),
  specialNote: z.string().max(200).optional(),
});

export const createOrderSchema = z.object({
  restaurantId: mongoId,
  items: z.array(orderItemSchema).min(1, 'Cart cannot be empty.'),
  trainNumber,
  pnr: pnr.optional(),
  boardingStation: z.string().min(1),
  deliveryStation: z.string().min(1),
  coach: coachNumber,
  seat: seatNumber,
  paymentMode: z.nativeEnum(PaymentMode),
  couponCode: z.string().optional(),
  idempotencyKey: z.string().uuid('Idempotency key must be a valid UUID.'),
  termsAccepted: z
    .boolean()
    .refine((value) => value === true, { message: 'You must accept the terms to place an order.' }),
});
export type CreateOrderDto = z.infer<typeof createOrderSchema>;

export const listOrdersQuerySchema = paginationQuery.merge(dateRangeQuery).extend({
  status: z.nativeEnum(OrderStatus).optional(),
  restaurantId: mongoId.optional(),
});
export type ListOrdersQueryDto = z.infer<typeof listOrdersQuerySchema>;

export const orderIdParamsSchema = z.object({ id: mongoId });
export type OrderIdParamsDto = z.infer<typeof orderIdParamsSchema>;

export const cancelOrderSchema = z.object({
  reason: z.string().min(3).max(500).optional(),
});
export type CancelOrderDto = z.infer<typeof cancelOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  note: z.string().max(500).optional(),
});
export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;
