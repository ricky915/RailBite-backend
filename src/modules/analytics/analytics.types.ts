export interface FunnelStepView {
  step: string;
  count: number;
  dropOffPercentage: number;
}

export interface FunnelAnalyticsResult {
  startDate: string;
  endDate: string;
  steps: FunnelStepView[];
}
