import winston from 'winston';

import { config } from '@/config/index';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp(),
  errors({ stack: true }),
  printf(({ timestamp: ts, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `${String(ts)} [${level}]: ${String(message)}${metaStr}`;
  }),
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

/**
 * Shared Winston logger (TRD 10.8, 21). Log levels: error, warn, info,
 * http, debug. Production logs at `info`; development at `debug`.
 */
export const logger = winston.createLogger({
  level: config.app.nodeEnv === 'production' ? 'info' : 'debug',
  format: config.app.nodeEnv === 'production' ? prodFormat : devFormat,
  transports: [new winston.transports.Console()],
});

if (config.app.nodeEnv === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
    }),
  );
}
