import { Router } from 'express';
import authenticationMiddleware from '@/middleware/authentication.middleware';
import { getOrderAnalyticsDay, getOrderAnalyticsMonth, getOrderAnalyticsYear } from '@/controllers/analytics.controller';

const analyticsRouter: Router = Router();

analyticsRouter.get('/analytics-order-year', getOrderAnalyticsYear);

analyticsRouter.get('/analytics-order-month', getOrderAnalyticsMonth);

analyticsRouter.get('/analytics-order-day', getOrderAnalyticsDay);

export default analyticsRouter;
