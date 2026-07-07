import { z } from 'zod';

import { mongoId } from '@/validations/common.validations';

export const orderIdParamsSchema = z.object({ orderId: mongoId });
export type OrderIdParamsDto = z.infer<typeof orderIdParamsSchema>;
