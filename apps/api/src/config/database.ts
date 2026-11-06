import dns from 'node:dns';
import mongoose from 'mongoose';

export async function connectDatabase(uri: string, dnsServers: string): Promise<void> {
  const servers = dnsServers.split(',').map((server) => server.trim()).filter(Boolean);
  if (servers.length > 0) dns.setServers(servers);
  await mongoose.connect(uri);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
