import type { Request, Response } from 'express';

import type { InitiatePaymentDto, OrderIdParamsDto, WebhookPayloadDto } from '@/modules/payments/payments.dto';
import type { PaymentsService } from '@/modules/payments/payments.service';
import { AuthenticationError } from '@/utils/errors';
import { successResponse } from '@/utils/responseFormatter';

export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  initiate = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AuthenticationError('Please log in to continue.');
    }
    const dto = req.body as InitiatePaymentDto;
    const result = await this.service.initiatePayment(dto, req.user.userId);
    successResponse(res, result, 'Payment initiated successfully.', 201);
  };

  getStatus = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AuthenticationError('Please log in to continue.');
    }
    const { orderId } = req.params as unknown as OrderIdParamsDto;
    const result = await this.service.getPaymentStatus(orderId, req.user.userId);
    successResponse(res, result, 'Payment status retrieved successfully.');
  };

  webhook = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as WebhookPayloadDto;
    const signature = (req.headers['x-razorpay-signature'] as string | undefined) ?? '';
    await this.service.handleWebhook(dto, signature);
    successResponse(res, null, 'Webhook processed successfully.');
  };
}
