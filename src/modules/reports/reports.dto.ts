import { z } from 'zod';

import { dateRangeQuery } from '@/validations/common.validations';

export const reportTypeParamsSchema = z.object({
  type: z.enum([
    'orders',
    'revenue',
    'restaurant-performance',
    'users',
    'coupons',
    'refunds',
    'support',
  ]),
});
export type ReportTypeParamsDto = z.infer<typeof reportTypeParamsSchema>;

export const reportQuerySchema = dateRangeQuery.extend({
  format: z.enum(['csv', 'pdf']).default('csv'),
});
export type ReportQueryDto = z.infer<typeof reportQuerySchema>;
