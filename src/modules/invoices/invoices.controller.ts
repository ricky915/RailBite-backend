import type { Request, Response } from 'express';

import type { OrderIdParamsDto } from '@/modules/invoices/invoices.dto';
import type { InvoicesService } from '@/modules/invoices/invoices.service';
import { AuthenticationError } from '@/utils/errors';
import { successResponse } from '@/utils/responseFormatter';

export class InvoicesController {
  constructor(private readonly service: InvoicesService) {}

  getForOrder = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AuthenticationError('Please log in to continue.');
    }
    const { orderId } = req.params as unknown as OrderIdParamsDto;
    const result = await this.service.getInvoiceForOrder(orderId, req.user.userId);
    successResponse(res, result, 'Invoice retrieved successfully.');
  };
}
