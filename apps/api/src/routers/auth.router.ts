import {
  getSessionUser,
  signinUser,
  signoutUser,
  signupUser,
} from '@/controllers/auth.controller';
import authenticationMiddleware from '@/middleware/authentication.middleware';
import { registerValidator } from '@/middleware/registerValidator.middleware';
import { Router } from 'express';

const authRouter: Router = Router();

authRouter.post('/signin', signinUser);
authRouter.post('/signup', registerValidator, signupUser);
authRouter.post('/signout', signoutUser);
authRouter.get('/session', authenticationMiddleware, getSessionUser);

export default authRouter;
