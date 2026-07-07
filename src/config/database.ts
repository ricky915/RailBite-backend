import dns from 'dns';

import mongoose from 'mongoose';

import { config } from '@/config/index';
import { logger } from '@/utils/logger';

// mongodb+srv:// URIs require Node to resolve SRV/TXT records via its bundled
// c-ares resolver, which on some Windows hosts mis-detects the system's DNS
// servers (falling back to 127.0.0.1, where nothing listens) even though
// normal hostname lookups work fine. Pointing c-ares at public resolvers
// avoids ECONNREFUSED on the Atlas SRV/TXT lookup regardless of host network config.
dns.setServers(['8.8.8.8', '1.1.1.1']);

mongoose.set('strictQuery', true);

/**
 * Establishes the Mongoose connection to MongoDB.
 * Connection pool sizing follows TRD 20.2 (minPoolSize: 5, maxPoolSize: 50).
 */
export async function connectDatabase(): Promise<typeof mongoose> {
  const connection = await mongoose.connect(config.db.mongoUri, {
    minPoolSize: 5,
    maxPoolSize: 50,
  });

  logger.info('MongoDB connected', { host: connection.connection.host });

  mongoose.connection.on('error', (error) => {
    logger.error('MongoDB connection error', { error: error.message });
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  return connection;
}

/**
 * Gracefully closes the Mongoose connection (used on process shutdown).
 */
export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected gracefully');
}
