export type ReportType =
  | 'orders'
  | 'revenue'
  | 'restaurant-performance'
  | 'users'
  | 'coupons'
  | 'refunds'
  | 'support';

export interface ReportResult {
  type: ReportType;
  generatedAt: Date;
  format: 'csv' | 'pdf';
  rowCount: number;
  downloadUrl?: string;
}
