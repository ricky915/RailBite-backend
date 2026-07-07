import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth.middleware';
import { publicRateLimiter } from '@/middleware/rateLimiter';
import { validate } from '@/middleware/validate.middleware';
import { TrainsController } from '@/modules/trains/trains.controller';
import { pnrParamsSchema, searchTrainQuerySchema } from '@/modules/trains/trains.dto';
import { TrainsRepository } from '@/modules/trains/trains.repository';
import { TrainsService } from '@/modules/trains/trains.service';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

const repository = new TrainsRepository();
const service = new TrainsService(repository);
const controller = new TrainsController(service);

/**
 * @openapi
 * /trains/search:
 *   get:
 *     summary: Search train schedule by train number + date
 *     tags: [Trains]
 *     responses:
 *       200: { description: Train schedule retrieved }
 *       422: { description: Validation failed }
 */
router.get(
  '/search',
  publicRateLimiter,
  validate({ query: searchTrainQuerySchema }),
  asyncHandler(controller.search),
);

/**
 * @openapi
 * /trains/pnr/{pnr}:
 *   get:
 *     summary: PNR lookup with passenger details
 *     tags: [Trains]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: PNR details retrieved }
 *       401: { description: Missing or invalid access token }
 */
router.get(
  '/pnr/:pnr',
  authMiddleware,
  validate({ params: pnrParamsSchema }),
  asyncHandler(controller.lookupPnr),
);

export const trainsRoutes = router;
