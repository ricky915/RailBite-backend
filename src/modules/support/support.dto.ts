import { z } from 'zod';

import { SupportTicketCategory, SupportTicketStatus } from '@/types/domain.types';
import { mongoId, paginationQuery } from '@/validations/common.validations';

export const createTicketSchema = z.object({
  orderId: mongoId.optional(),
  category: z.nativeEnum(SupportTicketCategory),
  description: z.string().min(10).max(1000),
  attachmentUrls: z.array(z.string().url()).max(3).default([]),
});
export type CreateTicketDto = z.infer<typeof createTicketSchema>;

export const ticketIdParamsSchema = z.object({ id: mongoId });
export type TicketIdParamsDto = z.infer<typeof ticketIdParamsSchema>;

export const listTicketsQuerySchema = paginationQuery.extend({
  status: z.nativeEnum(SupportTicketStatus).optional(),
});
export type ListTicketsQueryDto = z.infer<typeof listTicketsQuerySchema>;

export const updateTicketSchema = z.object({
  status: z.nativeEnum(SupportTicketStatus).optional(),
  message: z.string().min(1).max(1000).optional(),
});
export type UpdateTicketDto = z.infer<typeof updateTicketSchema>;
