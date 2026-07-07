import { z } from 'zod';

import { isoDateString, pnr, trainNumber } from '@/validations/common.validations';

export const searchTrainQuerySchema = z.object({
  trainNumber,
  date: isoDateString,
});
export type SearchTrainQueryDto = z.infer<typeof searchTrainQuerySchema>;

export const pnrParamsSchema = z.object({
  pnr,
});
export type PnrParamsDto = z.infer<typeof pnrParamsSchema>;
