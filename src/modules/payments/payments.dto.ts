import { z } from 'zod';

import { mongoId } from '@/validations/common.validations';

export const initiatePaymentSchema = z.object({
  orderId: mongoId,
});
export type InitiatePaymentDto = z.infer<typeof initiatePaymentSchema>;

export const orderIdParamsSchema = z.object({ orderId: mongoId });
export type OrderIdParamsDto = z.infer<typeof orderIdParamsSchema>;

/**
 * Razorpay webhook payload is intentionally loosely typed here — the
 * gateway's schema is validated against the documented Razorpay webhook
 * contract inside the service layer, not via this DTO (TRD 19 "Payment
 * Webhook").
 */
export const webhookPayloadSchema = z.object({
  event: z.string(),
  payload: z.record(z.unknown()),
});
export type WebhookPayloadDto = z.infer<typeof webhookPayloadSchema>;
