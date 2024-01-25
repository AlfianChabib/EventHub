import authenticationMiddleware from '@/middleware/authentication.middleware';
import { Router } from 'express';

const transactionRouter: Router = Router();

transactionRouter.post('/order', authenticationMiddleware);

export default transactionRouter;
