import { createServer } from 'node:http';
import { connectDatabase, disconnectDatabase } from './config/database';
import { getConfig } from './config/env';
import { createApp } from './app';

async function start() {
  const config = getConfig();
  await connectDatabase(config.MONGODB_URI, config.DNS_SERVERS);
  const server = createServer(createApp());
  server.listen(config.PORT, () => console.log(`API listening on port ${config.PORT}`));
  const shutdown = async () => { server.close(); await disconnectDatabase(); process.exit(0); };
  process.on('SIGINT', () => void shutdown());
  process.on('SIGTERM', () => void shutdown());
}

start().catch((error: unknown) => { console.error('Unable to start API', error); process.exit(1); });
