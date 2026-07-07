import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/role.middleware';
import { validate } from '@/middleware/validate.middleware';
import { SupportController } from '@/modules/support/support.controller';
import {
  createTicketSchema,
  listTicketsQuerySchema,
  ticketIdParamsSchema,
  updateTicketSchema,
} from '@/modules/support/support.dto';
import { SupportRepository } from '@/modules/support/support.repository';
import { SupportService } from '@/modules/support/support.service';
import { UserRole } from '@/types/domain.types';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

const repository = new SupportRepository();
const service = new SupportService(repository);
const controller = new SupportController(service);

/**
 * @openapi
 * /support/tickets:
 *   post:
 *     summary: Create a support ticket
 *     tags: [Support]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201: { description: Ticket created }
 */
router.post(
  '/tickets',
  authMiddleware,
  validate({ body: createTicketSchema }),
  asyncHandler(controller.createTicket),
);

/**
 * @openapi
 * /support/tickets:
 *   get:
 *     summary: List the authenticated passenger's own support tickets
 *     tags: [Support]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Tickets retrieved }
 */
router.get(
  '/tickets',
  authMiddleware,
  validate({ query: listTicketsQuerySchema }),
  asyncHandler(controller.listOwnTickets),
);

/**
 * @openapi
 * /support/tickets/{id}:
 *   get:
 *     summary: Get support ticket detail
 *     tags: [Support]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Ticket detail retrieved }
 */
router.get(
  '/tickets/:id',
  authMiddleware,
  validate({ params: ticketIdParamsSchema }),
  asyncHandler(controller.getTicketDetail),
);

/**
 * @openapi
 * /support/tickets/{id}:
 *   patch:
 *     summary: Update ticket status or add a message (support executive/admin)
 *     tags: [Support]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Ticket updated }
 */
router.patch(
  '/tickets/:id',
  authMiddleware,
  requireRole([UserRole.SUPPORT_EXEC, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validate({ params: ticketIdParamsSchema, body: updateTicketSchema }),
  asyncHandler(controller.updateTicket),
);

export const supportRoutes = router;
