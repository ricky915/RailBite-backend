import type { InvoicesRepository } from '@/modules/invoices/invoices.repository';
import type { InvoiceView } from '@/modules/invoices/invoices.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Invoice retrieval business logic (PRD 11.13). Scaffold: ownership
 * check (order.passengerId === requester) and on-demand generation are
 * planned for a later phase.
 */
export class InvoicesService {
  constructor(private readonly repository: InvoicesRepository) {}

  getInvoiceForOrder(orderId: string, requesterId: string): Promise<InvoiceView> {
    throw new NotImplementedError(
      `InvoicesService.getInvoiceForOrder(${orderId}, requester=${requesterId}) is not yet implemented.`,
    );
  }
}
