import type { ITrainSchedule } from '@/models/TrainSchedule.model';
import { NotImplementedError } from '@/utils/errors';

/**
 * Data access for cached train schedules (TRD 12.1 `trainSchedules`).
 * Scaffold: the actual IRCTC/RailAPI cache-read/write logic is planned
 * for a later phase (TRD 29 "TrainDataProvider interface").
 */
export class TrainsRepository {
  findByTrainNumberAndDate(trainNumberValue: string, date: string): Promise<ITrainSchedule | null> {
    throw new NotImplementedError(
      `TrainsRepository.findByTrainNumberAndDate(${trainNumberValue}, ${date}) is not yet implemented.`,
    );
  }

  upsertSchedule(data: Partial<ITrainSchedule>): Promise<ITrainSchedule> {
    throw new NotImplementedError(
      `TrainsRepository.upsertSchedule(${JSON.stringify(data)}) is not yet implemented.`,
    );
  }
}
