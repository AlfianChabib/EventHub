import { Router } from 'express';
import authenticationMiddleware from '@/middleware/authentication.middleware';
import {
  getAllAnalytics,
  getOrderAnalyticsDay,
  getOrderAnalyticsMonth,
  getOrderAnalyticsYear,
} from '@/controllers/analytics.controller';

const analyticsRouter: Router = Router();

analyticsRouter.get('/all/:eventId', authenticationMiddleware, getAllAnalytics);

analyticsRouter.get(
  '/analytics-order-year/:eventId',
  authenticationMiddleware,
  getOrderAnalyticsYear,
);

analyticsRouter.get(
  '/analytics-order-month/:eventId',
  authenticationMiddleware,
  getOrderAnalyticsMonth,
);

analyticsRouter.get(
  '/analytics-order-day/:eventId',
  authenticationMiddleware,
  getOrderAnalyticsDay,
);

export default analyticsRouter;
