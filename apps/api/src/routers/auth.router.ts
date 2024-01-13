import {
  signinUser,
  signoutUser,
  signupUser,
} from '@/controllers/auth.controller';
import { registerValidator } from '@/middleware/registerValidator.middleware';
import { Router } from 'express';

const authRouter: Router = Router();

authRouter.post('/signin', signinUser);
authRouter.post('/signup', registerValidator, signupUser);
authRouter.post('/signout', signoutUser);

export default authRouter;
