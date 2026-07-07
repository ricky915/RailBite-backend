import type { PaymentMode, PaymentStatus } from '@/types/domain.types';

export interface PaymentInitiationResult {
  paymentId: string;
  gatewayOrderId: string;
  amountPaise: number;
  currency: string;
  keyId: string;
}

export interface PaymentStatusView {
  orderId: string;
  mode: PaymentMode;
  status: PaymentStatus;
  amountPaise: number;
  refundedAmountPaise: number;
}
