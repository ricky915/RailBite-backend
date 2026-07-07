import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { InvoicesController } from '@/modules/invoices/invoices.controller';
import { orderIdParamsSchema } from '@/modules/invoices/invoices.dto';
import { InvoicesRepository } from '@/modules/invoices/invoices.repository';
import { InvoicesService } from '@/modules/invoices/invoices.service';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

const repository = new InvoicesRepository();
const service = new InvoicesService(repository);
const controller = new InvoicesController(service);

/**
 * @openapi
 * /invoices/{orderId}:
 *   get:
 *     summary: Download invoice PDF URL for a completed order
 *     tags: [Invoices]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Invoice retrieved }
 *       404: { description: Invoice not found }
 */
router.get(
  '/:orderId',
  authMiddleware,
  validate({ params: orderIdParamsSchema }),
  asyncHandler(controller.getForOrder),
);

export const invoicesRoutes = router;
