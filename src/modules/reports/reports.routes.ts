import { Router } from 'express';

import { validate } from '@/middleware/validate.middleware';
import { ReportsController } from '@/modules/reports/reports.controller';
import { reportQuerySchema, reportTypeParamsSchema } from '@/modules/reports/reports.dto';
import { ReportsRepository } from '@/modules/reports/reports.repository';
import { ReportsService } from '@/modules/reports/reports.service';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

const repository = new ReportsRepository();
const service = new ReportsService(repository);
const controller = new ReportsController(service);

/**
 * @openapi
 * /admin/reports/{type}:
 *   get:
 *     summary: Generate an operational/financial report by type
 *     tags: [Reports]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Report generated }
 *
 * # Note: mounted under the `admin` router, which applies authMiddleware +
 * # requireRole(['admin', 'super_admin']) to every route in this file.
 */
router.get(
  '/:type',
  validate({ params: reportTypeParamsSchema, query: reportQuerySchema }),
  asyncHandler(controller.generate),
);

export const reportsRoutes = router;
