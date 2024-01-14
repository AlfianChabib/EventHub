import { createEvent } from '@/controllers/event.controller';
import authenticationMiddleware from '@/middleware/authentication.middleware';
import { Router } from 'express';

const eventRouter: Router = Router();

eventRouter.post('/', authenticationMiddleware, createEvent);

export default eventRouter;
