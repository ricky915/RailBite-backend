import type { SearchTrainQueryDto } from '@/modules/trains/trains.dto';
import type { TrainsRepository } from '@/modules/trains/trains.repository';
import type { PnrLookupResult, TrainSearchResult } from '@/modules/trains/trains.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Train/PNR lookup business logic (PRD 11.3). Wraps the external
 * IRCTC/RailAPI provider behind a `TrainDataProvider`-style interface so
 * the underlying vendor can be swapped without touching order logic
 * (TRD 29/30.2). Scaffold: provider integration is planned for a later
 * phase.
 */
export class TrainsService {
  constructor(private readonly repository: TrainsRepository) {}

  searchTrain(dto: SearchTrainQueryDto): Promise<TrainSearchResult> {
    throw new NotImplementedError(
      `TrainsService.searchTrain(${dto.trainNumber}, ${dto.date}) is not yet implemented.`,
    );
  }

  lookupPnr(pnr: string, userId: string): Promise<PnrLookupResult> {
    throw new NotImplementedError(
      `TrainsService.lookupPnr(${pnr}) for user ${userId} is not yet implemented.`,
    );
  }
}
