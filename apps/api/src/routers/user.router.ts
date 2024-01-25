import {
  getEventPromotion,
  getPoint,
  getUserId,
  getVoucher,
  updateUser,
} from '@/controllers/user.controller';
import authenticationMiddleware from '@/middleware/authentication.middleware';
import { Router } from 'express';

const userRouter: Router = Router();

userRouter.get('/:id', getUserId);
userRouter.patch('/', authenticationMiddleware, updateUser);
userRouter.get('/voucher', authenticationMiddleware, getVoucher);
userRouter.get('/point', authenticationMiddleware, getPoint);
userRouter.get('/event-promotion', authenticationMiddleware, getEventPromotion);

export default userRouter;
