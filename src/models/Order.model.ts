import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { IOrderItem } from '@/models/OrderItem.model';
import { orderItemSchema } from '@/models/OrderItem.model';
import { OrderStatus, PaymentMode, PaymentStatus } from '@/types/domain.types';

export interface IOrderStatusHistoryEntry {
  status: string;
  timestamp: Date;
  updatedBy?: Types.ObjectId;
  note?: string;
}

/**
 * `orders` collection (TRD 12.2.2). Order header with an embedded
 * snapshot of items at time of order.
 */
export interface IOrder extends Document {
  orderId: string;
  passengerId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  trainNumber: string;
  pnr?: string;
  boardingStation: string;
  deliveryStation: string;
  deliveryStationEta: Date;
  coach: string;
  seat: string;
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  gstAmount: number;
  couponDiscount: number;
  grandTotal: number;
  couponCode?: string;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  statusHistory: IOrderStatusHistoryEntry[];
  cancellationReason?: string;
  idempotencyKey: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const statusHistorySchema = new Schema<IOrderStatusHistoryEntry>(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    note: { type: String },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    passengerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    trainNumber: { type: String, required: true, match: /^\d{5}$/ },
    pnr: { type: String, match: /^\d{10}$/ },
    boardingStation: { type: String, required: true },
    deliveryStation: { type: String, required: true },
    deliveryStationEta: { type: Date, required: true },
    coach: { type: String, required: true },
    seat: { type: String, required: true },
    items: { type: [orderItemSchema], default: [] },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    platformFee: { type: Number, required: true, min: 0 },
    gstAmount: { type: Number, required: true, min: 0 },
    couponDiscount: { type: Number, default: 0, min: 0 },
    grandTotal: { type: Number, required: true, min: 0 },
    couponCode: { type: String },
    paymentMode: { type: String, enum: Object.values(PaymentMode), required: true },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING_PAYMENT,
    },
    statusHistory: { type: [statusHistorySchema], default: [] },
    cancellationReason: { type: String },
    idempotencyKey: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

orderSchema.index({ passengerId: 1, createdAt: -1 });
orderSchema.index({ restaurantId: 1, status: 1 });
orderSchema.index({ trainNumber: 1, deliveryStation: 1, status: 1 });
orderSchema.index({ createdAt: -1 });

export const OrderModel = model<IOrder>('Order', orderSchema);
