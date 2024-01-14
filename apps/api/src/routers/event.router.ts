import { createEvent, updateEvent } from '@/controllers/event.controller';
import authenticationMiddleware from '@/middleware/authentication.middleware';
import { eventValidator } from '@/middleware/eventValidator.middleware';
import { Router } from 'express';

const eventRouter: Router = Router();

eventRouter.post('/', authenticationMiddleware, eventValidator, createEvent);
eventRouter.post('/:id', authenticationMiddleware, updateEvent);

export default eventRouter;
