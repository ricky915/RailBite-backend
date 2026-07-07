import type { Request, Response } from 'express';

import type { PnrParamsDto, SearchTrainQueryDto } from '@/modules/trains/trains.dto';
import type { TrainsService } from '@/modules/trains/trains.service';
import { AuthenticationError } from '@/utils/errors';
import { successResponse } from '@/utils/responseFormatter';

export class TrainsController {
  constructor(private readonly service: TrainsService) {}

  search = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as SearchTrainQueryDto;
    const result = await this.service.searchTrain(query);
    successResponse(res, result, 'Train schedule retrieved successfully.');
  };

  lookupPnr = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AuthenticationError('Please log in to continue.');
    }
    const { pnr } = req.params as unknown as PnrParamsDto;
    const result = await this.service.lookupPnr(pnr, req.user.userId);
    successResponse(res, result, 'PNR details retrieved successfully.');
  };
}
