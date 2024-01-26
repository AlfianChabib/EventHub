import { generateReferral } from '@/common/helpers/referral.helper';
import prisma from '@/prisma';
import { Request, Response } from 'express';

interface OrderData {
  ticketTierId?: number;
  referralCode?: string;
  voucherId?: number;
  points: Point[];
  eventId: number;
}

interface Point {
  pointId: number;
}

export const orderEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const {
      eventId,
      voucherId,
      ticketTierId,
      points,
      referralCode,
    }: OrderData = req.body;
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
      include: {
        voucher: true,
        point: true,
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
        id: eventId,
      },
      include: {
        TicketTier: true,
        eventPromotion: true,
      },
    });

    if (!eventWithId) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Event not found',
      });
    }

    if (!eventWithId.eventPromotion) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Event promotion not found',
      });
    }

    if (!eventWithId.TicketTier) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Ticket tier not found',
      });
    }

    if (!eventWithId.eventPromotion) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Event promotion not found',
      });
    }

    if (!userWithId.point) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Point not found',
      });
    }

    const calcTotalAmount = (): number => {
      let result = eventWithId.price;
      if (ticketTierId) {
        const ticketTier = eventWithId.TicketTier.find(
          (t) => t.id === ticketTierId,
        );
        if (ticketTier) {
          result = ticketTier.price;
        }
      }

      if (voucherId) {
        const voucher = userWithId.voucher.find((v) => v.id === voucherId);

        if (voucher) {
          result = result - 10000;
        }
      }

      if (points) {
        let i = 0;
        while (i < points.length) {
          const point = userWithId.point.find(
            (p) => p.id === points[i].pointId,
          );
          if (point) {
            result = result - 10000;
          }
        }
      }

      if (referralCode) {
        const eventPromotion = eventWithId.eventPromotion.find(
          (ep) => ep.code === referralCode,
        );
        if (eventPromotion) {
          result = result - eventPromotion.discount;
        }
      }

      return result;
    };

    const generateEventReferralCode = generateReferral(eventWithId.title);

    const expiredEvent = new Date(eventWithId.startDate).getTime();
    if (expiredEvent < new Date().getTime()) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Event has expired',
      });
    }

    if (!points && !voucherId && !referralCode && !ticketTierId) {
      const order = await prisma.$transaction(async (prisma) => {
        await prisma.transaction.create({
          data: {
            userId: userWithId.id,
            eventId: eventId,
            totalAmount: eventWithId.price,
          },
        });

        await prisma.ticket.create({
          data: {
            userId: userWithId.id,
            eventId: eventId,
            eventTitle: eventWithId.title,
            eventDate: eventWithId.startDate,
          },
        });

        await prisma.eventPromotion.create({
          data: {
            userId: userWithId.id,
            eventId: eventId,
            code: generateEventReferralCode,
            count: 5,
            discount: 10000,
          },
        });

        return res.status(200).json({
          code: 200,
          success: true,
          message: 'Order successfully',
        });
      });
    }

    const order = await prisma.$transaction(async (prisma) => {
      await prisma.transaction.create({
        data: {
          userId: userWithId.id,
          eventId: eventId,
          totalAmount: calcTotalAmount(),
        },
      });

      await prisma.ticket.create({
        data: {
          userId: userWithId.id,
          eventId: eventWithId.id,
          eventTitle: eventWithId.title,
          eventDate: eventWithId.startDate,
        },
      });

      await prisma.eventPromotion.create({
        data: {
          userId: userWithId.id,
          eventId: eventId,
          code: generateEventReferralCode,
          count: 5,
          discount: 10000,
        },
      });
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
