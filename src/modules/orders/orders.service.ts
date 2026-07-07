import type {
  CancelOrderDto,
  CreateOrderDto,
  ListOrdersQueryDto,
  UpdateOrderStatusDto,
} from '@/modules/orders/orders.dto';
import type { OrdersRepository } from '@/modules/orders/orders.repository';
import type { OrderDetailView } from '@/modules/orders/orders.types';
import type { PaginatedResult } from '@/types/domain.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Order lifecycle business logic (PRD 11.10, 13.1, 14.3). Scaffold: the
 * full order-placement flow (price re-validation, payment initiation,
 * idempotency handling, status transitions, cancellation policy) is
 * planned for a later phase — see PRD 13.4/13.5 for the rules to
 * implement.
 */
export class OrdersService {
  constructor(private readonly repository: OrdersRepository) {}

  placeOrder(dto: CreateOrderDto, passengerId: string): Promise<OrderDetailView> {
    throw new NotImplementedError(
      `OrdersService.placeOrder(passenger=${passengerId}, restaurant=${dto.restaurantId}, idempotencyKey=${dto.idempotencyKey}) is not yet implemented.`,
    );
  }

  listOwnOrders(query: ListOrdersQueryDto, passengerId: string): Promise<PaginatedResult<OrderDetailView>> {
    throw new NotImplementedError(
      `OrdersService.listOwnOrders(passenger=${passengerId}, ${JSON.stringify(query)}) is not yet implemented.`,
    );
  }

  getOrderDetail(id: string, requesterId: string): Promise<OrderDetailView> {
    throw new NotImplementedError(
      `OrdersService.getOrderDetail(${id}, requester=${requesterId}) is not yet implemented.`,
    );
  }

  cancelOrder(id: string, dto: CancelOrderDto, passengerId: string): Promise<OrderDetailView> {
    throw new NotImplementedError(
      `OrdersService.cancelOrder(${id}, passenger=${passengerId}, reason=${dto.reason ?? ''}) is not yet implemented.`,
    );
  }

  updateOrderStatus(id: string, dto: UpdateOrderStatusDto, actorId: string): Promise<OrderDetailView> {
    throw new NotImplementedError(
      `OrdersService.updateOrderStatus(${id}, status=${dto.status}, actor=${actorId}) is not yet implemented.`,
    );
  }
}
