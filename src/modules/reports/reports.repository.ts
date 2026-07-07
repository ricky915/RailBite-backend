import { NotImplementedError } from '@/utils/errors';

/**
 * Data access for the reports module (TRD 3.2.4, 5.3). Reports are
 * generated on-demand from the primary collections (TRD 11.17 "not
 * pre-rendered") — the concrete aggregation queries per report type are
 * planned for a later phase.
 */
export class ReportsRepository {
  aggregateOrdersReport(startDate: string, endDate: string): Promise<Record<string, unknown>[]> {
    throw new NotImplementedError(
      `ReportsRepository.aggregateOrdersReport(${startDate}, ${endDate}) is not yet implemented.`,
    );
  }
}
