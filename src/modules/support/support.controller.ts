import type { Request, Response } from 'express';

import type {
  CreateTicketDto,
  ListTicketsQueryDto,
  TicketIdParamsDto,
  UpdateTicketDto,
} from '@/modules/support/support.dto';
import type { SupportService } from '@/modules/support/support.service';
import { AuthenticationError } from '@/utils/errors';
import { successResponse } from '@/utils/responseFormatter';

function requireUserId(req: Request): string {
  if (!req.user) {
    throw new AuthenticationError('Please log in to continue.');
  }
  return req.user.userId;
}

export class SupportController {
  constructor(private readonly service: SupportService) {}

  createTicket = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as CreateTicketDto;
    const result = await this.service.createTicket(dto, requireUserId(req));
    successResponse(res, result, 'Support ticket created successfully.', 201);
  };

  listOwnTickets = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as ListTicketsQueryDto;
    const result = await this.service.listOwnTickets(query, requireUserId(req));
    successResponse(res, result, 'Support tickets retrieved successfully.');
  };

  getTicketDetail = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as TicketIdParamsDto;
    const result = await this.service.getTicketDetail(id, requireUserId(req));
    successResponse(res, result, 'Support ticket detail retrieved successfully.');
  };

  updateTicket = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as TicketIdParamsDto;
    const dto = req.body as UpdateTicketDto;
    const result = await this.service.updateTicket(id, dto, requireUserId(req));
    successResponse(res, result, 'Support ticket updated successfully.');
  };
}
