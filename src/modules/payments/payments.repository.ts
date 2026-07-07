import type { IPayment } from '@/models/Payment.model';
import { NotImplementedError } from '@/utils/errors';

/**
 * Data access for the payments module (TRD 3.2.4, 5.3, `payments`
 * collection). Scaffold: gateway order creation, capture, and refund
 * persistence are planned for a later phase.
 */
export class PaymentsRepository {
  findByOrderId(orderId: string): Promise<IPayment | null> {
    throw new NotImplementedError(`PaymentsRepository.findByOrderId(${orderId}) is not yet implemented.`);
  }

  findByGatewayPaymentId(gatewayPaymentId: string): Promise<IPayment | null> {
    throw new NotImplementedError(
      `PaymentsRepository.findByGatewayPaymentId(${gatewayPaymentId}) is not yet implemented.`,
    );
  }

  create(data: Partial<IPayment>): Promise<IPayment> {
    throw new NotImplementedError(
      `PaymentsRepository.create(${JSON.stringify(data)}) is not yet implemented.`,
    );
  }

  updateById(id: string, data: Partial<IPayment>): Promise<IPayment | null> {
    throw new NotImplementedError(
      `PaymentsRepository.updateById(${id}, ${JSON.stringify(data)}) is not yet implemented.`,
    );
  }
}
