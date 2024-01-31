import { Router } from 'express';
import authRouter from '@/routers/auth.router';
import userRouter from '@/routers/user.router';
import eventRouter from '@/routers/event.router';
import transactionRouter from '@/routers/transaction.router';
import analyticsRouter from '@/routers/analytics.router';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/event', eventRouter);
apiRouter.use('/transaction', transactionRouter);
apiRouter.use('/analytics', analyticsRouter);

export default apiRouter;
