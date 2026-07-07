import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

import { PaymentMode, PaymentStatus } from '@/types/domain.types';

/**
 * `payments` collection (TRD 12.1). References the order via `orderId`;
 * stores the gateway transaction reference and raw response for audit.
 */
export interface IPayment extends Document {
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  mode: PaymentMode;
  status: PaymentStatus;
  amountPaise: number;
  currency: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  gatewayResponse?: Record<string, unknown>;
  refundedAmountPaise: number;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mode: { type: String, enum: Object.values(PaymentMode), required: true },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    amountPaise: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    gatewayOrderId: { type: String },
    gatewayPaymentId: { type: String },
    gatewaySignature: { type: String },
    gatewayResponse: { type: Schema.Types.Mixed },
    refundedAmountPaise: { type: Number, default: 0, min: 0 },
    failureReason: { type: String },
  },
  { timestamps: true },
);

paymentSchema.index({ orderId: 1 });
paymentSchema.index({ gatewayPaymentId: 1 });

export const PaymentModel = model<IPayment>('Payment', paymentSchema);
