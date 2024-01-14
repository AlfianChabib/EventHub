import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';

export interface createEventPayload {
  title: string;
  description: string;
  location: string;
  category: string;
  image: string;
  price: number;
  seats: number;
  eventDate: string;
  isPresale: boolean;
  expireDate?: Date;
  discount?: number;
  isPercent?: boolean;
}

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.body;

    const {
      title,
      description,
      location,
      category,
      image,
      price,
      seats,
      eventDate,
      isPresale,
      expireDate,
      discount,
      isPercent,
    }: createEventPayload = req.body;

    const parsedId = parseInt(id);

    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
      });
    }

    const transactionEvent = await prisma.$transaction(async (prisma) => {
      const userWithId = await prisma.user.findUnique({
        where: {
          id: parsedId,
        },
      });

      if (!userWithId) {
        return res.status(404).json({
          code: 404,
          message: 'User not found',
        });
      }

      const updateUser = await prisma.user.update({
        where: {
          id: userWithId.id,
        },
        data: {
          role: 'eventOrganizer',
        },
      });

      const event = await prisma.event.create({
        data: {
          title,
          description,
          location,
          category,
          image,
          price,
          seats,
          event_date: eventDate,
          isPresale,
          expireDate,
          discount,
          isPercent,
        },
      });
      
      res.status(201).json({
        code: 201,
        success: true,
        message: 'Event created successfully',
        data: event,
      });
    });
  } catch (error) {
    next(error);
  }
};
