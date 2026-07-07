import type { Request, Response } from 'express';

import type {
  CancelOrderDto,
  CreateOrderDto,
  ListOrdersQueryDto,
  OrderIdParamsDto,
  UpdateOrderStatusDto,
} from '@/modules/orders/orders.dto';
import type { OrdersService } from '@/modules/orders/orders.service';
import { AuthenticationError } from '@/utils/errors';
import { successResponse } from '@/utils/responseFormatter';

function requireUserId(req: Request): string {
  if (!req.user) {
    throw new AuthenticationError('Please log in to continue.');
  }
  return req.user.userId;
}

export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  placeOrder = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as CreateOrderDto;
    const result = await this.service.placeOrder(dto, requireUserId(req));
    successResponse(res, result, 'Order placed successfully.', 201);
  };

  listOwnOrders = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as ListOrdersQueryDto;
    const result = await this.service.listOwnOrders(query, requireUserId(req));
    successResponse(res, result, 'Orders retrieved successfully.');
  };

  getOrderDetail = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as OrderIdParamsDto;
    const result = await this.service.getOrderDetail(id, requireUserId(req));
    successResponse(res, result, 'Order detail retrieved successfully.');
  };

  cancelOrder = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as OrderIdParamsDto;
    const dto = req.body as CancelOrderDto;
    const result = await this.service.cancelOrder(id, dto, requireUserId(req));
    successResponse(res, result, 'Order cancelled successfully.');
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as OrderIdParamsDto;
    const dto = req.body as UpdateOrderStatusDto;
    const result = await this.service.updateOrderStatus(id, dto, requireUserId(req));
    successResponse(res, result, 'Order status updated successfully.');
  };
}
