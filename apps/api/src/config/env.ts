import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1).optional(),
  JWT_ACCESS_SECRET: z.string().min(32).optional(),
  JWT_REFRESH_SECRET: z.string().min(32).optional(),
  WEB_ORIGIN: z.string().url().transform((value) => value.replace(/\/+$/, '')).default('http://localhost:3000'),
  DNS_SERVERS: z.string().default('1.1.1.1,8.8.8.8'),
  ALLOW_PUBLIC_INTERNAL_ROLES: z.string().optional().transform((value) => value === 'true'),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  APP_BASE_URL: z.string().url().transform((value) => value.replace(/\/+$/, '')).default('http://localhost:3000'),
  ENQUIRY_NOTIFICATION_EMAILS: z.string().optional(),
  COOKIE_SECURE: z.string().optional().transform((value) => value === 'true')
});

export interface AppConfig {
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
  MONGODB_URI: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  WEB_ORIGIN: string;
  DNS_SERVERS: string;
  ALLOW_PUBLIC_INTERNAL_ROLES: boolean;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  APP_BASE_URL: string;
  ENQUIRY_NOTIFICATION_EMAILS?: string;
  COOKIE_SECURE: boolean;
}

export function getConfig(): AppConfig {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
  }
  const config = parsed.data;
  if (config.NODE_ENV === 'production' && (!config.MONGODB_URI || !config.JWT_ACCESS_SECRET || !config.JWT_REFRESH_SECRET)) {
    throw new Error('MONGODB_URI, JWT_ACCESS_SECRET, and JWT_REFRESH_SECRET are required in production');
  }
  return {
    ...config,
    MONGODB_URI: config.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/search-fund-platform',
    JWT_ACCESS_SECRET: config.JWT_ACCESS_SECRET ?? 'development-access-secret-change-me-123456',
    JWT_REFRESH_SECRET: config.JWT_REFRESH_SECRET ?? 'development-refresh-secret-change-me-123456'
  };
}
