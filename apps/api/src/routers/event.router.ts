import { createEvent, updateEvent } from '@/controllers/event.controller';
import { imageUploader } from '@/controllers/upload.controller';
import authenticationMiddleware from '@/middleware/authentication.middleware';
import { eventValidator } from '@/middleware/eventValidator.middleware';
import upload from '@/middleware/uploader.middleware';
import { Router } from 'express';

const eventRouter: Router = Router();

eventRouter.post('/', authenticationMiddleware, eventValidator, createEvent);
eventRouter.post(
  '/image-upload',
  upload.single('image'),
  imageUploader,
);
// eventRouter.patch('/:id', authenticationMiddleware, updateEvent);

export default eventRouter;
