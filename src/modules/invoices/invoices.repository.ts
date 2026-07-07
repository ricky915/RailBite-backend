import type { IInvoice } from '@/models/Invoice.model';
import { NotImplementedError } from '@/utils/errors';

/**
 * Data access for the invoices module (TRD 3.2.4, 5.3, `invoices`
 * collection). Scaffold: invoice generation (delegating to the shared
 * `pdf.service.ts`) and sequential financial-year numbering are planned
 * for a later phase.
 */
export class InvoicesRepository {
  findByOrderId(orderId: string): Promise<IInvoice | null> {
    throw new NotImplementedError(`InvoicesRepository.findByOrderId(${orderId}) is not yet implemented.`);
  }

  create(data: Partial<IInvoice>): Promise<IInvoice> {
    throw new NotImplementedError(
      `InvoicesRepository.create(${JSON.stringify(data)}) is not yet implemented.`,
    );
  }
}
