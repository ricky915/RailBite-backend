import type { Request, Response } from 'express';

import type { ReportQueryDto, ReportTypeParamsDto } from '@/modules/reports/reports.dto';
import type { ReportsService } from '@/modules/reports/reports.service';
import { AuthenticationError } from '@/utils/errors';
import { successResponse } from '@/utils/responseFormatter';

export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  generate = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AuthenticationError('Please log in to continue.');
    }
    const { type } = req.params as unknown as ReportTypeParamsDto;
    const query = req.query as unknown as ReportQueryDto;
    const result = await this.service.generateReport(type, query, req.user.userId);
    successResponse(res, result, 'Report generated successfully.');
  };
}
