import type { InitiatePaymentDto, WebhookPayloadDto } from '@/modules/payments/payments.dto';
import type { PaymentsRepository } from '@/modules/payments/payments.repository';
import type { PaymentInitiationResult, PaymentStatusView } from '@/modules/payments/payments.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Payment processing business logic (PRD 11.8, TRD 19). Scaffold: real
 * Razorpay order creation, webhook signature verification (HMAC-SHA256),
 * and idempotent capture handling are planned for a later phase.
 */
export class PaymentsService {
  constructor(private readonly repository: PaymentsRepository) {}

  initiatePayment(dto: InitiatePaymentDto, userId: string): Promise<PaymentInitiationResult> {
    throw new NotImplementedError(
      `PaymentsService.initiatePayment(order=${dto.orderId}, user=${userId}) is not yet implemented.`,
    );
  }

  getPaymentStatus(orderId: string, userId: string): Promise<PaymentStatusView> {
    throw new NotImplementedError(
      `PaymentsService.getPaymentStatus(${orderId}, user=${userId}) is not yet implemented.`,
    );
  }

  handleWebhook(dto: WebhookPayloadDto, signature: string): Promise<void> {
    throw new NotImplementedError(
      `PaymentsService.handleWebhook(event=${dto.event}, signaturePresent=${Boolean(signature)}) is not yet implemented.`,
    );
  }
}
