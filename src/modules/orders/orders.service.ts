import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';

import { GST_RATE_PERCENT, MIN_DELIVERY_WINDOW_MINUTES, PLATFORM_FEE_PAISE } from '@/config/constants';
import type { IOrder } from '@/models/Order.model';
import type {
  CancelOrderDto,
  CreateOrderDto,
  ListOrdersQueryDto,
  UpdateOrderStatusDto,
} from '@/modules/orders/orders.dto';
import type { OrdersRepository } from '@/modules/orders/orders.repository';
import type { OrderDetailView } from '@/modules/orders/orders.types';
import { OrderStatus, PaymentMode, PaymentStatus } from '@/types/domain.types';
import type { PaginatedResult } from '@/types/domain.types';
import { AuthorizationError, NotFoundError, ValidationError } from '@/utils/errors';
import { generateOrderId } from '@/utils/orderIdGenerator';
import { paginate } from '@/utils/pagination';

const CANCELLABLE_STATUSES = new Set<OrderStatus>([
  OrderStatus.ORDER_PLACED,
  OrderStatus.RESTAURANT_NOTIFIED,
  OrderStatus.RESTAURANT_ACCEPTED,
  OrderStatus.PREPARING,
]);

function toOrderDetailView(order: IOrder): OrderDetailView {
  return {
    id: order.id as string,
    orderId: order.orderId,
    restaurantId: order.restaurantId.toString(),
    trainNumber: order.trainNumber,
    deliveryStation: order.deliveryStation,
    coach: order.coach,
    seat: order.seat,
    status: order.status,
    paymentMode: order.paymentMode,
    paymentStatus: order.paymentStatus,
    items: order.items.map((item) => ({
      menuItemId: item.menuItemId.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      itemTotal: item.itemTotal,
    })),
    grandTotal: order.grandTotal,
    statusHistory: order.statusHistory.map((entry) => ({
      status: entry.status,
      timestamp: entry.timestamp,
      note: entry.note,
    })),
    createdAt: order.createdAt,
  };
}

/**
 * Order lifecycle business logic (PRD 11.10, 13.1, 14.3). Price/availability
 * re-validation, idempotent placement, and status transitions are
 * implemented for the core passenger flow. Coupon application, refund
 * processing, and payment-gateway integration remain scaffolded for a
 * later phase — online payments are simulated as immediately captured.
 */
export class OrdersService {
  constructor(private readonly repository: OrdersRepository) {}

  async placeOrder(dto: CreateOrderDto, passengerId: string): Promise<OrderDetailView> {
    const existing = await this.repository.findByIdempotencyKey(dto.idempotencyKey);
    if (existing) {
      return toOrderDetailView(existing);
    }

    const restaurant = await this.repository.findRestaurantById(dto.restaurantId);
    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundError('Restaurant not found or not currently accepting orders.');
    }

    const menus = await this.repository.findMenusByRestaurantId(dto.restaurantId);
    const itemsById = new Map(
      menus.flatMap((menu) => menu.items.map((item) => [item._id.toString(), item] as const)),
    );

    let subtotal = 0;
    const orderItems = dto.items.map((cartItem) => {
      const menuItem = itemsById.get(cartItem.menuItemId);
      if (!menuItem || !menuItem.isAvailable) {
        throw new ValidationError('One or more items in your cart are no longer available.');
      }
      const additionalCharge = cartItem.customizations.reduce((sum, c) => sum + c.additionalCharge, 0);
      const itemTotal = (menuItem.pricePaise + additionalCharge) * cartItem.quantity;
      subtotal += itemTotal;
      return {
        menuItemId: new Types.ObjectId(menuItem._id.toString()),
        name: menuItem.name,
        price: menuItem.pricePaise,
        quantity: cartItem.quantity,
        customizations: cartItem.customizations,
        specialNote: cartItem.specialNote,
        itemTotal,
      };
    });

    if (subtotal < restaurant.minOrderValuePaise) {
      throw new ValidationError(
        `Minimum order value for ${restaurant.name} is ₹${(restaurant.minOrderValuePaise / 100).toFixed(2)}.`,
      );
    }
    if (dto.paymentMode === PaymentMode.COD && !restaurant.isCodEnabled) {
      throw new ValidationError('Cash on delivery is not available for this restaurant.');
    }

    const deliveryFee = restaurant.deliveryFeePaise;
    const platformFee = PLATFORM_FEE_PAISE;
    const gstAmount = Math.round((subtotal * GST_RATE_PERCENT) / 100);
    const grandTotal = subtotal + deliveryFee + platformFee + gstAmount;

    // No payment gateway is wired up yet (the payments module remains
    // scaffolded) — online payments are simulated as captured immediately,
    // COD orders are captured on delivery.
    const paymentStatus =
      dto.paymentMode === PaymentMode.ONLINE ? PaymentStatus.CAPTURED : PaymentStatus.PENDING;

    const now = new Date();
    const sequence = (await this.repository.countAll()) + 1;

    const order = await this.repository.create({
      orderId: generateOrderId(sequence, now),
      passengerId: new Types.ObjectId(passengerId),
      restaurantId: new Types.ObjectId(dto.restaurantId),
      trainNumber: dto.trainNumber,
      pnr: dto.pnr,
      boardingStation: dto.boardingStation,
      deliveryStation: dto.deliveryStation,
      deliveryStationEta: new Date(now.getTime() + MIN_DELIVERY_WINDOW_MINUTES * 60_000),
      coach: dto.coach,
      seat: dto.seat,
      items: orderItems,
      subtotal,
      deliveryFee,
      platformFee,
      gstAmount,
      couponDiscount: 0,
      grandTotal,
      paymentMode: dto.paymentMode,
      paymentStatus,
      status: OrderStatus.ORDER_PLACED,
      statusHistory: [{ status: OrderStatus.ORDER_PLACED, timestamp: now }],
      idempotencyKey: dto.idempotencyKey,
    });

    return toOrderDetailView(order);
  }

  async listOwnOrders(query: ListOrdersQueryDto, passengerId: string): Promise<PaginatedResult<OrderDetailView>> {
    const { skip, limit, page, pageSize } = paginate(query.page, query.pageSize);

    const filter: FilterQuery<IOrder> = { passengerId, isDeleted: false };
    if (query.status) filter.status = query.status;
    if (query.restaurantId) filter.restaurantId = query.restaurantId;
    if (query.startDate || query.endDate) {
      filter.createdAt = {
        ...(query.startDate ? { $gte: new Date(query.startDate) } : {}),
        ...(query.endDate ? { $lte: new Date(query.endDate) } : {}),
      };
    }

    const result = await this.repository.findMany(filter, skip, limit);

    return {
      data: result.data.map(toOrderDetailView),
      total: result.total,
      page,
      pageSize,
      totalPages: result.totalPages,
    };
  }

  async getOrderDetail(id: string, requesterId: string): Promise<OrderDetailView> {
    const order = await this.repository.findById(id);
    if (!order) {
      throw new NotFoundError('Order not found.');
    }
    if (order.passengerId.toString() !== requesterId) {
      throw new AuthorizationError('You do not have permission to view this order.');
    }
    return toOrderDetailView(order);
  }

  async cancelOrder(id: string, dto: CancelOrderDto, passengerId: string): Promise<OrderDetailView> {
    const order = await this.repository.findById(id);
    if (!order) {
      throw new NotFoundError('Order not found.');
    }
    if (order.passengerId.toString() !== passengerId) {
      throw new AuthorizationError('You do not have permission to cancel this order.');
    }
    if (!CANCELLABLE_STATUSES.has(order.status)) {
      throw new ValidationError(`Orders in "${order.status}" status can no longer be cancelled.`);
    }

    const now = new Date();
    const updated = await this.repository.updateById(id, {
      status: OrderStatus.CANCELLED_BY_PASSENGER,
      cancellationReason: dto.reason,
      statusHistory: [
        ...order.statusHistory,
        { status: OrderStatus.CANCELLED_BY_PASSENGER, timestamp: now, note: dto.reason },
      ],
    });

    return toOrderDetailView(updated ?? order);
  }

  async updateOrderStatus(id: string, dto: UpdateOrderStatusDto, actorId: string): Promise<OrderDetailView> {
    const order = await this.repository.findById(id);
    if (!order) {
      throw new NotFoundError('Order not found.');
    }

    const updated = await this.repository.updateById(id, {
      status: dto.status,
      statusHistory: [
        ...order.statusHistory,
        { status: dto.status, timestamp: new Date(), updatedBy: new Types.ObjectId(actorId), note: dto.note },
      ],
    });

    return toOrderDetailView(updated ?? order);
  }
}
