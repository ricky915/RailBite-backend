import type { Request, Response } from 'express';

import type { FunnelQueryDto } from '@/modules/analytics/analytics.dto';
import type { AnalyticsService } from '@/modules/analytics/analytics.service';
import { successResponse } from '@/utils/responseFormatter';

export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  getFunnel = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as FunnelQueryDto;
    const result = await this.service.getFunnel(query);
    successResponse(res, result, 'Funnel analytics retrieved successfully.');
  };
}
