import type { OrderStatus, PaymentMode, PaymentStatus } from '@/types/domain.types';

export interface OrderStatusHistoryEntryView {
  status: string;
  timestamp: Date;
  note?: string;
}

export interface OrderDetailView {
  id: string;
  orderId: string;
  restaurantId: string;
  trainNumber: string;
  deliveryStation: string;
  coach: string;
  seat: string;
  status: OrderStatus;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  grandTotal: number;
  statusHistory: OrderStatusHistoryEntryView[];
  createdAt: Date;
}
