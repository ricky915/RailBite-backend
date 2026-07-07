import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { PaymentsController } from '@/modules/payments/payments.controller';
import {
  initiatePaymentSchema,
  orderIdParamsSchema,
  webhookPayloadSchema,
} from '@/modules/payments/payments.dto';
import { PaymentsRepository } from '@/modules/payments/payments.repository';
import { PaymentsService } from '@/modules/payments/payments.service';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

const repository = new PaymentsRepository();
const service = new PaymentsService(repository);
const controller = new PaymentsController(service);

/**
 * @openapi
 * /payments/initiate:
 *   post:
 *     summary: Initiate a payment for an order
 *     tags: [Payments]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201: { description: Payment initiated }
 */
router.post(
  '/initiate',
  authMiddleware,
  validate({ body: initiatePaymentSchema }),
  asyncHandler(controller.initiate),
);

/**
 * @openapi
 * /payments/{orderId}/status:
 *   get:
 *     summary: Poll the payment status for an order
 *     tags: [Payments]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Payment status retrieved }
 */
router.get(
  '/:orderId/status',
  authMiddleware,
  validate({ params: orderIdParamsSchema }),
  asyncHandler(controller.getStatus),
);

/**
 * @openapi
 * /payments/webhook:
 *   post:
 *     summary: Razorpay payment webhook handler (HMAC-SHA256 signed)
 *     tags: [Payments]
 *     responses:
 *       200: { description: Webhook processed }
 */
router.post('/webhook', validate({ body: webhookPayloadSchema }), asyncHandler(controller.webhook));

export const paymentsRoutes = router;
