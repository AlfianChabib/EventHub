import { Request, Response } from 'express';
import prisma from '@/prisma';

export interface createEventPayload {
  title: string;
  description: string;
  location: string;
  category: string;
  price: number;
  seats: number;
  startDate: Date;
  endDate: Date;
  duration: string;
}

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const {
      title,
      description,
      location,
      category,
      price,
      seats,
      startDate,
      endDate,
      duration,
    }: createEventPayload = req.body;

    const parsedId = parseInt(id);

    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
      });
    }

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

    const dateStart = new Date(startDate);
    const dateEnd = new Date(endDate);

    const transactionEvent = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.update({
        where: {
          id: userWithId.id,
        },
        data: {
          role: 'eventOrganizer',
        },
      });

      const event = await prisma.event.create({
        data: {
          userId: user.id,
          title,
          description,
          location,
          category,
          price,
          seats,
          startDate: dateStart,
          endDate: dateEnd,
          duration,
        },
      });
      return { user, event };
    });

    return res.status(201).json({
      code: 201,
      success: true,
      message: `Create event ${title} has been successfully`,
      data: {
        eventId: transactionEvent.event.id,
        duration,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    return res.status(200).json({ id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Internal server error',
    });
  }
};
