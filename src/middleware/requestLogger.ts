import { randomUUID } from 'crypto';

import type { NextFunction, Request, Response } from 'express';

import { logger } from '@/utils/logger';

/**
 * Logs every HTTP request/response pair at the `http` level (TRD 10.5,
 * 21). Generates a per-request correlation id (`X-Request-ID`) used for
 * tracing across logs.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = (req.headers['x-request-id'] as string | undefined) ?? randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);

  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const latencyMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    logger.log('http', 'HTTP request', {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      latencyMs: Math.round(latencyMs * 100) / 100,
      userId: req.user?.userId,
      ip: req.ip,
    });
  });

  next();
}
