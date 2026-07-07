import { z } from 'zod';

import { dateRangeQuery } from '@/validations/common.validations';

export const funnelQuerySchema = dateRangeQuery.extend({
  stationCode: z.string().optional(),
  restaurantId: z.string().optional(),
});
export type FunnelQueryDto = z.infer<typeof funnelQuerySchema>;
