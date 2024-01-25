import { Router } from 'express';
import { imageUploader } from '@/controllers/upload.controller';
import authenticationMiddleware from '@/middleware/authentication.middleware';
import upload from '@/middleware/uploader.middleware';
import {
  eventValidator,
  updateEventValidator,
} from '@/middleware/eventValidator.middleware';
import {
  createEvent,
  deleteEvent,
  getAllEvent,
  getAllEventSession,
  getEventById,
  getEventId,
  updateEvent,
} from '@/controllers/event.controller';

const eventRouter: Router = Router();

eventRouter.get('/', getAllEvent);

eventRouter.get('/:eventId', getEventId);

eventRouter.post('/', authenticationMiddleware, eventValidator, createEvent);

eventRouter.patch(
  '/management/update/:eventId',
  authenticationMiddleware,
  updateEventValidator,
  updateEvent,
);

eventRouter.delete(
  '/management/delete/:eventId',
  authenticationMiddleware,
  deleteEvent,
);

eventRouter.get('/management/:eventId', authenticationMiddleware, getEventById);

eventRouter.get('/management', authenticationMiddleware, getAllEventSession);

eventRouter.post('/image-upload', upload.single('image'), imageUploader);

export default eventRouter;
