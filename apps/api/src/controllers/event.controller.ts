import { Request, Response } from 'express';
import prisma from '@/prisma';
import { create } from 'ts-node';

export interface DiscountEventPayload {
  discount: number;
  discountEndDate: Date;
  discountStartDate: Date;
}

export interface TicketTierPayload {
  nameTier: string;
  price: number;
  description: string;
}

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
  discountEvent?: DiscountEventPayload;
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
  discountEvent?: DiscountEventPayload;
  ticketTiers?: TicketTierPayload[];
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
      discountEvent,
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

      if (!ticketTiers && !discountEvent) {
        await prisma.event.create({
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

      if (discountEvent && !ticketTiers) {
        const discountStartDate = new Date(discountEvent.discountStartDate);
        const discountEndDate = new Date(discountEvent.discountEndDate);
        await prisma.event.create({
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
            discount: {
              create: {
                discount: discountEvent.discount,
                discountEndDate: discountEndDate,
                discountStartDate: discountStartDate,
              },
            },
          },
        });
      }

      if (!discountEvent && ticketTiers) {
        await prisma.event.create({
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
      }

      if (discountEvent && ticketTiers) {
        const discountStartDate = new Date(discountEvent.discountStartDate);
        const discountEndDate = new Date(discountEvent.discountEndDate);
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
            discount: {
              create: {
                discount: discountEvent.discount,
                discountEndDate: discountEndDate,
                discountStartDate: discountStartDate,
              },
            },
            TicketTier: {
              createMany: {
                data: ticketTiers,
              },
            },
          },
        });
      }
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
      discountEvent,
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
      if (!ticketTiers && !discountEvent) {
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

      if (!ticketTiers && discountEvent) {
        const discountStartDate = new Date(discountEvent.discountStartDate);
        const discountEndDate = new Date(discountEvent.discountEndDate);
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
            discount: {
              delete: {
                eventId: eventWithId.id,
              },
              create: {
                discount: discountEvent.discount,
                discountEndDate: discountEndDate,
                discountStartDate: discountStartDate,
              },
            },
          },
        });
      }

      if (!discountEvent && ticketTiers) {
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
      }

      if (discountEvent && ticketTiers) {
        const discountStartDate = new Date(discountEvent.discountStartDate);
        const discountEndDate = new Date(discountEvent.discountEndDate);
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
            discount: {
              delete: {
                eventId: eventWithId.id,
              },
              create: {
                discount: discountEvent.discount,
                discountEndDate: discountEndDate,
                discountStartDate: discountStartDate,
              },
            },
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
      }
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

    const deleteDiscount = prisma.discount.delete({
      where: {
        eventId: eventWithId.id,
      },
    });

    const deleteEventPromotion = prisma.eventPromotion.deleteMany({
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
      deleteEventPromotion,
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
    const parsedEventId = parseInt(eventId);

    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Invalid ID, please provide a valid ID',
      });
    }

    if (!parsedEventId || isNaN(parsedEventId)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Invalid event ID, please provide a valid event ID',
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

    if (eventWithId.id !== userWithId.id) {
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
export const getEventSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const parsedId = parseInt(id);

    const userWithId = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        event: true,
      },
    });

    if (!userWithId) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      code: 200,
      success: true,
      data: userWithId.event,
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
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const offset = (page - 1) * limit;

    if (page < 1 || isNaN(page)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Invalid page number',
      });
    }

    const events = await prisma.event.findMany({
      skip: offset,
      take: limit,
      where: {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
        category: {
          contains: category,
        },
      },
    });

    let totalEvents = await prisma.event.count();

    if (search !== undefined) {
      totalEvents = await prisma.event.count({
        where: {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
      });
    }

    if (limit < 1 || isNaN(limit)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Invalid limit number',
      });
    }

    if (search !== undefined && events.length === 0) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: `Event ${search} not found, please try again with different search`,
      });
    }

    const totalPages = Math.ceil(totalEvents / limit);

    if (page > totalPages) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Page not found',
      });
    }

    const allCategorys = await prisma.event.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
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
        totalEvents: totalEvents,
        limit: limit,
        offset: offset,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        categorys: allCategorys,
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

export const getEventId = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const parsedEventId = parseInt(eventId);

    if (!parsedEventId || isNaN(parsedEventId)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Invalid ID, please provide a valid ID',
      });
    }

    const eventWithId = await prisma.event.findUnique({
      where: {
        id: parsedEventId,
      },
      include: {
        discount: true,
        TicketTier: true,
      },
    });

    if (!eventWithId) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Event not found',
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
