import { Request, Response } from 'express';
import prisma from '@/prisma';
import {
  generateCurrentDayData,
  generateCurrentMonthData,
  generateLast12MonthsData,
} from '../utils/analytics.generator';

export const getAllAnalytics = async (req: Request, res: Response) => {
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

    const eventWithId = await prisma.event.findUnique({
      where: {
        id: parsedEventId,
        userId: parsedId,
      },
      include: {
        EventReview: {
          select: {
            rating: true,
          },
        },
        transaction: {
          select: {
            id: true,
          },
        },
        Ticket: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!eventWithId) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Event not found',
      });
    }

    const rating = eventWithId.EventReview.map((review) => review.rating);
    const totalRating = rating.reduce((a, b) => a + b, 0);
    let averageRating = Math.floor(totalRating / rating.length);
    if (!averageRating) averageRating = 0;
    let totalTickets = eventWithId.Ticket.length;
    if (!totalTickets) totalTickets = 0;
    let totalTransactions = eventWithId.transaction.length;
    if (!totalTransactions) totalTransactions = 0;

    const orderDay = await generateCurrentDayData(parsedId, eventWithId.id);
    const orderMonth = await generateCurrentMonthData(parsedId, eventWithId.id);
    const orderYear = await generateLast12MonthsData(parsedId, eventWithId.id);

    return res.status(200).json({
      success: true,
      data: {
        eventId: eventWithId.id,
        title: eventWithId.title,
        averageRating,
        totalTickets,
        totalTransactions,
        orderDay: orderDay.currentDayData,
        orderMonth: orderMonth.currentMonthData,
        orderYear: orderYear.last12Months,
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

export const getOrderAnalyticsYear = async (req: Request, res: Response) => {
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

    const order = await generateLast12MonthsData(parsedId, parsedEventId);
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getOrderAnalyticsMonth = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const { eventId } = req.params;
    const parsedEventID = parseInt(eventId);
    const parsedId = parseInt(id);

    const order = await generateCurrentMonthData(parsedId, parsedEventID);
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getOrderAnalyticsDay = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const { eventId } = req.params;
    const parsedEventID = parseInt(eventId);
    const parsedId = parseInt(id);

    const order = await generateCurrentDayData(parsedId, parsedEventID);
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Internal server error',
    });
  }
};
