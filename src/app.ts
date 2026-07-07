import compression from 'compression';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { config } from '@/config/index';
import { swaggerSpec } from '@/config/swagger';
import { globalErrorHandler, notFoundHandler } from '@/middleware/errorHandler';
import { publicRateLimiter } from '@/middleware/rateLimiter';
import { requestLogger } from '@/middleware/requestLogger';
import { apiRouter } from '@/routes/index';

/**
 * Express application setup (TRD 10.1). Middleware registration order
 * MUST NOT change:
 *   1. helmet()                 - security headers
 *   2. cors(corsOptions)        - origin whitelist
 *   3. compression()            - gzip/brotli response compression (TRD 20.2)
 *   4. express.json()           - body parser (10mb limit)
 *   5. express.urlencoded()     - form body parser
 *   6. requestLogger            - Winston request log
 *   7. rateLimiter               - express-rate-limit
 *   8. /api/v1 routes           - feature routers
 *   9. 404 handler              - catch-all not-found
 *  10. globalErrorHandler       - last middleware
 *
 * No `.listen()` call here — that lives in `server.ts` (TRD 4.2).
 */
export function createApp(): Express {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: true,
      hsts: { maxAge: 31536000 },
      frameguard: { action: 'deny' },
      noSniff: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );

  app.use(
    cors({
      origin: config.cors.allowedOrigins,
      credentials: false,
    }),
  );

  app.use(compression());

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(requestLogger);

  app.use(publicRateLimiter);

  // Swagger UI (TRD 11.5): mounted at /api/docs, blocked in production.
  if (config.swagger.enabled && config.app.nodeEnv !== 'production') {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, statusCode: 200, message: 'OK', data: { status: 'healthy' } });
  });

  app.use(`/api/${config.app.apiVersion}`, apiRouter);

  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
}
