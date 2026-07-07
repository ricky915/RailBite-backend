import type { ReportQueryDto } from '@/modules/reports/reports.dto';
import type { ReportsRepository } from '@/modules/reports/reports.repository';
import type { ReportResult, ReportType } from '@/modules/reports/reports.types';
import { NotImplementedError } from '@/utils/errors';

/**
 * Report generation business logic (PRD 11.17). Scaffold: per-type
 * aggregation, async generation for >10K rows, and email delivery of the
 * download link are planned for a later phase.
 */
export class ReportsService {
  constructor(private readonly repository: ReportsRepository) {}

  generateReport(type: ReportType, query: ReportQueryDto, adminUserId: string): Promise<ReportResult> {
    throw new NotImplementedError(
      `ReportsService.generateReport(${type}, admin=${adminUserId}, ${JSON.stringify(query)}) is not yet implemented.`,
    );
  }
}
