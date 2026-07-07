import type { ISupportTicket } from '@/models/SupportTicket.model';
import type { PaginatedResult } from '@/types/domain.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Data access for the support module (TRD 3.2.4, 5.3, `supportTickets`
 * collection). Scaffold: ticket queue ordering, SLA tracking, and
 * escalation persistence are planned for a later phase.
 */
export class SupportRepository {
  findById(id: string): Promise<ISupportTicket | null> {
    throw new NotImplementedError(`SupportRepository.findById(${id}) is not yet implemented.`);
  }

  findMany(
    filter: Record<string, unknown>,
    skip: number,
    limit: number,
  ): Promise<PaginatedResult<ISupportTicket>> {
    throw new NotImplementedError(
      `SupportRepository.findMany(${JSON.stringify(filter)}, skip=${skip}, limit=${limit}) is not yet implemented.`,
    );
  }

  create(data: Partial<ISupportTicket>): Promise<ISupportTicket> {
    throw new NotImplementedError(
      `SupportRepository.create(${JSON.stringify(data)}) is not yet implemented.`,
    );
  }

  updateById(id: string, data: Partial<ISupportTicket>): Promise<ISupportTicket | null> {
    throw new NotImplementedError(
      `SupportRepository.updateById(${id}, ${JSON.stringify(data)}) is not yet implemented.`,
    );
  }
}
