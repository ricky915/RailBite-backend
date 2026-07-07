/**
 * Global domain enums and interfaces shared across backend modules.
 * Business-rule sources: TRD 12 (Database Design), PRD 11/13/14.
 */

export enum UserRole {
  PASSENGER = 'passenger',
  RESTAURANT_MANAGER = 'restaurant_manager',
  RESTAURANT_STAFF = 'restaurant_staff',
  SUPPORT_EXEC = 'support_exec',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  ORDER_PLACED = 'ORDER_PLACED',
  RESTAURANT_NOTIFIED = 'RESTAURANT_NOTIFIED',
  RESTAURANT_ACCEPTED = 'RESTAURANT_ACCEPTED',
  RESTAURANT_REJECTED = 'RESTAURANT_REJECTED',
  PREPARING = 'PREPARING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  DELIVERY_FAILED = 'DELIVERY_FAILED',
  CANCELLED_BY_PASSENGER = 'CANCELLED_BY_PASSENGER',
  CANCELLED_BY_RESTAURANT = 'CANCELLED_BY_RESTAURANT',
  CANCELLED_BY_ADMIN = 'CANCELLED_BY_ADMIN',
  REFUND_INITIATED = 'REFUND_INITIATED',
  REFUND_PROCESSED = 'REFUND_PROCESSED',
  REFUND_FAILED = 'REFUND_FAILED',
  COMPLETED = 'COMPLETED',
}

export enum PaymentMode {
  ONLINE = 'online',
  COD = 'cod',
}

export enum PaymentStatus {
  PENDING = 'pending',
  CAPTURED = 'captured',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIAL_REFUND = 'partial_refund',
}

export enum NotificationChannel {
  SMS = 'sms',
  EMAIL = 'email',
  IN_APP = 'in_app',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

export enum SupportTicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum SupportTicketCategory {
  WRONG_ORDER = 'wrong_order',
  ORDER_NOT_DELIVERED = 'order_not_delivered',
  FOOD_QUALITY = 'food_quality',
  REFUND_INQUIRY = 'refund_inquiry',
  ACCOUNT_ISSUE = 'account_issue',
  OTHER = 'other',
}

export enum RestaurantStatus {
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

export enum CouponDiscountType {
  PERCENTAGE = 'percentage',
  FLAT = 'flat',
  FREE_DELIVERY = 'free_delivery',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  STATUS_CHANGE = 'STATUS_CHANGE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

/**
 * Standard shape for repository-level paginated results, before being
 * mapped into the API response envelope's `meta` block.
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CustomizationSnapshot {
  label: string;
  value: string;
  additionalCharge: number;
}
