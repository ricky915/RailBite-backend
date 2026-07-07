import type { AnalyticsRepository } from '@/modules/analytics/analytics.repository';
import type { FunnelQueryDto } from '@/modules/analytics/analytics.dto';
import type { FunnelAnalyticsResult } from '@/modules/analytics/analytics.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Analytics business logic (PRD 11.18). Scaffold: funnel/cohort/revenue
 * aggregations are planned for a later phase.
 */
export class AnalyticsService {
  constructor(private readonly repository: AnalyticsRepository) {}

  getFunnel(query: FunnelQueryDto): Promise<FunnelAnalyticsResult> {
    throw new NotImplementedError(
      `AnalyticsService.getFunnel(${JSON.stringify(query)}) is not yet implemented.`,
    );
  }
}
