import { NotImplementedError } from '@/utils/errors';

/**
 * Data access for the analytics module (TRD 3.2.4, 5.3). Per TRD 11.18,
 * aggregations are intended to run against a reporting-oriented data
 * path (not the primary application DB) to avoid impacting production
 * performance — the concrete aggregation pipelines are planned for a
 * later phase.
 */
export class AnalyticsRepository {
  computeFunnelCounts(startDate: string, endDate: string): Promise<Record<string, number>> {
    throw new NotImplementedError(
      `AnalyticsRepository.computeFunnelCounts(${startDate}, ${endDate}) is not yet implemented.`,
    );
  }
}
