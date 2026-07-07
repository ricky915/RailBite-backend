import type { OrderStatus, PaymentMode, PaymentStatus } from '@/types/domain.types';

export interface OrderStatusHistoryEntryView {
  status: string;
  timestamp: Date;
  note?: string;
}

export interface OrderItemView {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  itemTotal: number;
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
  items: OrderItemView[];
  grandTotal: number;
  statusHistory: OrderStatusHistoryEntryView[];
  createdAt: Date;
}
