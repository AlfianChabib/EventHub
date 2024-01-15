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
  eventDate: Date;
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
    }: createEventPayload = req.body;

    const parsedId = parseInt(id);

    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
      });
    }

    const date = new Date(eventDate);

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

    const transactionEvent = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.update({
        where: {
          id: userWithId.id,
        },
        data: {
          role: 'eventOrganizer',
        },
      });

      await prisma.event.create({
        data: {
          userId: user.id,
          title,
          description,
          location,
          category,
          image,
          price,
          seats,
          event_date: date,
        },
      });
    });

    return res.status(201).json({
      code: 201,
      success: true,
      message: `Create event ${title} has been successfully`,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    return res.status(200).json({ id });
  } catch (error) {
    next(error);
  }
};
