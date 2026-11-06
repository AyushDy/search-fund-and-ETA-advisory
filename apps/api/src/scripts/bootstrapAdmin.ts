import argon2 from 'argon2';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { getConfig } from '../config/env';
import { User } from '../models/User';

async function bootstrap() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  const firstName = process.env.BOOTSTRAP_ADMIN_FIRST_NAME ?? 'Platform';
  const lastName = process.env.BOOTSTRAP_ADMIN_LAST_NAME ?? 'Administrator';
  if (!email || !password) throw new Error('BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD are required');
  const config = getConfig();
  await connectDatabase(config.MONGODB_URI, config.DNS_SERVERS);
  const existing = await User.findOne({ email });
  if (existing) throw new Error('An account with the bootstrap email already exists; no changes were made');
  await User.create({ email, firstName, lastName, role: 'ADMIN', passwordHash: await argon2.hash(password, { type: argon2.argon2id }) });
  console.log('Initial administrator created');
  await disconnectDatabase();
}

bootstrap().catch(async (error: unknown) => { console.error(error); await disconnectDatabase(); process.exit(1); });
