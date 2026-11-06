import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { getConfig } from './config/env';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import listingRoutes from './routes/listingRoutes';
import enquiryRoutes from './routes/enquiryRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { sendSuccess } from './utils/response';

export function createApp() {
  const app = express();
  const config = getConfig();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: config.WEB_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(pinoHttp({ autoLogging: config.NODE_ENV !== 'test' }));
  app.get('/health', (_request, response) => sendSuccess(response, { status: 'ok' }, 'API is running'));
  app.use('/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false }), authRoutes);
  app.use('/users', rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false }), userRoutes);
  app.use('/', listingRoutes);
  app.use('/', enquiryRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
