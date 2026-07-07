import { Router } from 'express';

import { validate } from '@/middleware/validate.middleware';
import { AnalyticsController } from '@/modules/analytics/analytics.controller';
import { funnelQuerySchema } from '@/modules/analytics/analytics.dto';
import { AnalyticsRepository } from '@/modules/analytics/analytics.repository';
import { AnalyticsService } from '@/modules/analytics/analytics.service';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

const repository = new AnalyticsRepository();
const service = new AnalyticsService(repository);
const controller = new AnalyticsController(service);

/**
 * @openapi
 * /admin/analytics/funnel:
 *   get:
 *     summary: Conversion funnel data (search to order placed)
 *     tags: [Analytics]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Funnel analytics retrieved }
 *
 * # Note: mounted under the `admin` router, which applies authMiddleware +
 * # requireRole(['admin', 'super_admin']) to every route in this file.
 */
router.get('/funnel', validate({ query: funnelQuerySchema }), asyncHandler(controller.getFunnel));

export const analyticsRoutes = router;
