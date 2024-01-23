import { Request, Response } from 'express';
import prisma from '@/prisma';

export interface CreateEventPayload {
  title: string;
  description: string;
  location: string;
  category: string;
  price: number;
  seats: number;
  startDate: Date;
  endDate: Date;
  duration: string;
  ticketTiers?: TicketTierPayload[];
}
export interface UpdateEventPayload {
  title?: string;
  description?: string;
  location?: string;
  category?: string;
  image?: string;
  price?: number;
  seats?: number;
  startDate?: Date;
  endDate?: Date;
  duration?: string;
  ticketTiers?: TicketTierPayload[];
}

export interface TicketTierPayload {
  nameTier: string;
  price: number;
  description: string;
}

// Create Event all users
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
      ticketTiers,
    }: CreateEventPayload = req.body;

    const parsedId = parseInt(id);

    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Invalid ID, please provide a valid ID',
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
        success: false,
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
          role: 'event-organizer',
        },
      });

      if (!ticketTiers) {
        return await prisma.event.create({
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
      }

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
          TicketTier: {
            createMany: {
              data: ticketTiers,
            },
          },
        },
      });
    });

    return res.status(201).json({
      code: 201,
      success: true,
      message: `Create event ${title} has been successfully`,
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

// Update Event admin or event organizer only
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const { eventId } = req.params;
    const {
      title,
      description,
      location,
      category,
      image,
      price,
      seats,
      startDate,
      endDate,
      duration,
      ticketTiers,
    }: UpdateEventPayload = req.body;

    const parsedId = parseInt(id);

    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Invalid ID, please provide a valid ID',
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
        success: false,
        message: 'User not found',
      });
    }

    const eventWithId = await prisma.event.findUnique({
      where: {
        id: parseInt(eventId),
      },
    });

    if (!eventWithId) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Event not found',
      });
    }

    if (eventWithId.userId !== userWithId.id) {
      return res.status(403).json({
        code: 403,
        success: false,
        message: 'You are not authorized to update this event',
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Start date and end date are required',
      });
    }

    const dateStart = new Date(startDate);
    const dateEnd = new Date(endDate);

    const transactionEvent = await prisma.$transaction(async (prisma) => {
      if (!ticketTiers) {
        return await prisma.event.update({
          where: {
            id: eventWithId.id,
          },
          data: {
            title,
            description,
            location,
            category,
            image,
            price,
            seats,
            startDate: dateStart,
            endDate: dateEnd,
            duration,
          },
        });
      }

      await prisma.event.update({
        where: {
          id: eventWithId.id,
        },
        data: {
          title,
          description,
          location,
          category,
          image,
          price,
          seats,
          startDate: dateStart,
          endDate: dateEnd,
          duration,
          TicketTier: {
            deleteMany: {
              eventId: eventWithId.id,
            },
            createMany: {
              data: ticketTiers,
            },
          },
        },
      });
    });

    return res.status(200).json({
      code: 200,
      success: true,
      message: `Update event ${title} has been successfully`,
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

// Delete event admin or event organizer only
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const { eventId } = req.params;
    const parsedId = parseInt(id);

    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Invalid ID, please provide a valid ID',
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
        success: false,
        message: 'User not found',
      });
    }

    const eventWithId = await prisma.event.findUnique({
      where: {
        id: parseInt(eventId),
      },
    });

    if (!eventWithId) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Event not found',
      });
    }

    if (eventWithId.userId !== userWithId.id) {
      return res.status(403).json({
        code: 403,
        success: false,
        message: 'You are not authorized to delete this event',
      });
    }

    const deleteTicketTiers = prisma.ticketTier.deleteMany({
      where: {
        eventId: eventWithId.id,
      },
    });

    const deleteTicket = prisma.ticket.deleteMany({
      where: {
        eventId: eventWithId.id,
      },
    });

    const deleteEventReview = prisma.eventReview.deleteMany({
      where: {
        eventId: eventWithId.id,
      },
    });

    const deleteDiscount = prisma.discount.deleteMany({
      where: {
        eventId: eventWithId.id,
      },
    });

    const deletedEvent = prisma.event.delete({
      where: {
        id: eventWithId.id,
      },
    });

    const transactionDeleteEvent = await prisma.$transaction([
      deleteTicketTiers,
      deleteTicket,
      deleteEventReview,
      deleteDiscount,
      deletedEvent,
    ]);

    return res.status(200).json({
      code: 200,
      success: true,
      message: `Delete event ${eventWithId.title} has been successfully`,
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

// Get event by id admin or event organizer only
export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const { eventId } = req.params;
    const parsedId = parseInt(id);

    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Invalid ID, please provide a valid ID',
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
        success: false,
        message: 'User not found',
      });
    }

    const eventWithId = await prisma.event.findUnique({
      where: {
        id: parseInt(eventId),
      },
    });

    if (!eventWithId) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Event not found',
      });
    }

    if (eventWithId.userId !== userWithId.id) {
      return res.status(403).json({
        code: 403,
        success: false,
        message: 'You are not authorized to view this event',
      });
    }

    return res.status(200).json({
      code: 200,
      success: true,
      data: eventWithId,
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

// Get all event admin or event organizer only
export const getAllEventSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const parsedId = parseInt(id);

    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Invalid ID, please provide a valid ID',
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
        success: false,
        message: 'User not found',
      });
    }

    const events = await prisma.event.findMany({
      where: {
        userId: userWithId.id,
      },
    });

    return res.status(200).json({
      code: 200,
      success: true,
      data: events,
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

// Get all event all users
export const getAllEvent = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    if (page < 1 || isNaN(page)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Invalid page number',
      });
    }

    if (limit < 1 || isNaN(limit)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Invalid limit number',
      });
    }

    const count = await prisma.event.count();

    if (count === 0) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'No event found',
      });
    }

    const totalPages = Math.ceil(count / limit);

    if (page > totalPages) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Page not found',
      });
    }

    const events = await prisma.event.findMany({
      skip: offset,
      take: limit,
    });

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        events,
        totalPages,
        currentPage: page,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        totalEvents: count,
        limit: limit,
        offset: offset,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        count: events.length,
        pages: Math.ceil(count / limit),
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

export const postEventReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const { eventId } = req.params;
    const parsedUserId = parseInt(id);
    const parsedEventId = parseInt(eventId);

    const { review, rating } = req.body;

    if (!parsedUserId || isNaN(parsedUserId)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Invalid ID, please provide a valid ID',
      });
    }

    const userWithId = await prisma.event.findUnique({
      where: {
        id: parsedUserId,
      },
    });

    if (!userWithId) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'User not found',
      });
    }

    const eventWithId = await prisma.event.findUnique({
      where: {
        id: parsedEventId,
      },
    });

    if (!eventWithId) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Event not found',
      });
    }

    const getTicketEvent = await prisma.ticket.findFirst({
      where: {
        eventId: parsedEventId,
        userId: parsedUserId,
      },
    });

    if (getTicketEvent) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'You have already reviewed this event',
      });
    }

    const createReview = await prisma.eventReview.create({
      data: {
        rating,
        reveiw: review,
        eventId: parsedEventId,
        userId: parsedUserId,
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
