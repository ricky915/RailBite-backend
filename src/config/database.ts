import mongoose from 'mongoose';

import { config } from '@/config/index';
import { logger } from '@/utils/logger';

mongoose.set('strictQuery', true);

export async function connectDatabase(): Promise<typeof mongoose> {
  mongoose.connection.on('error', (error: unknown) => {
    logger.error('MongoDB connection error', { error: error instanceof Error ? error.message : error });
  });
  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  const connection = await mongoose.connect(config.mongo.uri);
  logger.info('MongoDB connected', { host: connection.connection.host, db: connection.connection.name });
  return connection;
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected gracefully');
}
