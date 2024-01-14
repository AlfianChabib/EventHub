import { getUserId, updateUser } from '@/controllers/user.controller';
import authenticationMiddleware from '@/middleware/authentication.middleware';
import { Router } from 'express';

const userRouter: Router = Router();

userRouter.get('/:id', getUserId);
userRouter.patch('/', authenticationMiddleware, updateUser);

export default userRouter;
