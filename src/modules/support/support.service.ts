import type {
  CreateTicketDto,
  ListTicketsQueryDto,
  UpdateTicketDto,
} from '@/modules/support/support.dto';
import type { SupportRepository } from '@/modules/support/support.repository';
import type { SupportTicketView } from '@/modules/support/support.types';
import type { PaginatedResult } from '@/types/domain.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Support ticket business logic (PRD 11.14). Scaffold: SLA/priority
 * assignment (order-in-progress tickets are Priority), escalation
 * workflow, and CSAT dispatch are planned for a later phase.
 */
export class SupportService {
  constructor(private readonly repository: SupportRepository) {}

  createTicket(dto: CreateTicketDto, passengerId: string): Promise<SupportTicketView> {
    throw new NotImplementedError(
      `SupportService.createTicket(passenger=${passengerId}, category=${dto.category}) is not yet implemented.`,
    );
  }

  listOwnTickets(query: ListTicketsQueryDto, passengerId: string): Promise<PaginatedResult<SupportTicketView>> {
    throw new NotImplementedError(
      `SupportService.listOwnTickets(passenger=${passengerId}, ${JSON.stringify(query)}) is not yet implemented.`,
    );
  }

  getTicketDetail(id: string, requesterId: string): Promise<SupportTicketView> {
    throw new NotImplementedError(
      `SupportService.getTicketDetail(${id}, requester=${requesterId}) is not yet implemented.`,
    );
  }

  updateTicket(id: string, dto: UpdateTicketDto, actorId: string): Promise<SupportTicketView> {
    throw new NotImplementedError(
      `SupportService.updateTicket(${id}, actor=${actorId}, ${JSON.stringify(dto)}) is not yet implemented.`,
    );
  }
}
