import { Router } from 'express';
import authRouter from '@/routers/auth.router';
import userRouter from '@/routers/user.router';
import eventRouter from '@/routers/event.router';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/event', eventRouter);

export default apiRouter;
