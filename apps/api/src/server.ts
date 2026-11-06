import { createServer } from 'node:http';
import { connectDatabase, disconnectDatabase } from './config/database';
import { getConfig } from './config/env';
import { createApp } from './app';

async function start() {
  const config = getConfig();
  const app = createApp();
  const server = createServer(app);
  server.listen(config.PORT, () => console.log(`API listening on port ${config.PORT}`));
  try {
    await connectDatabase(config.MONGODB_URI, config.DNS_SERVERS);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed; API is listening but not ready for database-backed requests', error);
    process.exitCode = 1;
  }
  const shutdown = async () => { server.close(); await disconnectDatabase(); process.exit(0); };
  process.on('SIGINT', () => void shutdown());
  process.on('SIGTERM', () => void shutdown());
}

start().catch((error: unknown) => { console.error('Unable to start API', error); process.exit(1); });
