import type { OrderStatus, RestaurantStatus } from '@/types/domain.types';

export interface AdminOrderListItemView {
  id: string;
  orderId: string;
  passengerId: string;
  restaurantId: string;
  status: OrderStatus;
  grandTotal: number;
  createdAt: Date;
}

export interface AdminRestaurantApplicationView {
  id: string;
  name: string;
  status: RestaurantStatus;
  fssaiLicenseNumber: string;
  gstin: string;
  createdAt: Date;
}

export interface AuditLogEntryView {
  id: string;
  actor: { userId: string; name: string; role: string };
  action: string;
  module: string;
  resourceId?: string;
  createdAt: Date;
}
