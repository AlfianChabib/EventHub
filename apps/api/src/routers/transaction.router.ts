import { orderEvent } from '@/controllers/transaction.controller';
import authenticationMiddleware from '@/middleware/authentication.middleware';
import { Router } from 'express';

const transactionRouter: Router = Router();

transactionRouter.post('/order', authenticationMiddleware, orderEvent);

export default transactionRouter;
