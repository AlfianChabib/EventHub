import { generateReferral } from '@/common/helpers/referral.helper';
import prisma from '@/prisma';
import { Request, Response } from 'express';

interface OrderData {
  ticketTierId?: number;
  referralCode?: string;
  voucherId?: number;
  points?: number[];
  eventId: number;
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
        eventPromotion: true,
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
        discount: true,
      },
    });

    if (!eventWithId) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Event not found',
      });
    }

    const eventPromotionWithId = await prisma.eventPromotion.findFirst({
      where: {
        eventId: eventWithId.id,
        userId: userWithId.id,
      },
    });

    const expiredEvent = new Date(eventWithId.startDate);
    if (expiredEvent < new Date()) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Event has expired',
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
        if (
          userWithId.voucher.find((v) => v.id === voucherId) &&
          userWithId.voucher.find((v) => v.expireDate > new Date())
        ) {
          result -= 10000;
        }
      }

      if (points) {
        points.forEach((p) => {
          userWithId.point.forEach((point) => {
            if (point.id === p && point.expireDate > new Date()) {
              result -= 10000;
            }
          });
        });
      }

      if (referralCode) {
        eventWithId.eventPromotion.forEach((ep) => {
          if (ep.code === referralCode && ep.count > 0) {
            result -= 10000;
          }
        });
      }

      if (eventWithId.discount) {
        if (
          eventWithId.discount.discountStartDate < new Date() &&
          eventWithId.discount.discountEndDate > new Date()
        ) {
          result -= eventWithId.discount.discount;
        }
      }

      return result;
    };

    const generateEventReferralCode = generateReferral(eventWithId.title);

    const order = await prisma.$transaction(async (prisma) => {
      const addTransaction = await prisma.transaction.create({
        data: {
          userId: userWithId.id,
          eventId: eventId,
          totalAmount: calcTotalAmount(),
        },
      });

      const addTicket = await prisma.ticket.create({
        data: {
          userId: userWithId.id,
          eventId: eventWithId.id,
          eventTitle: eventWithId.title,
          eventDate: eventWithId.startDate,
        },
      });

      if (
        ticketTierId &&
        eventWithId.TicketTier.find((t) => t.id === ticketTierId)
      ) {
        await prisma.ticket.update({
          where: {
            id: addTicket.id,
          },
          data: {
            ticketTier: {
              connect: {
                id: ticketTierId,
              },
            },
          },
        });
      }

      const updateEvent = await prisma.event.update({
        where: {
          id: eventWithId.id,
        },
        data: {
          seats: {
            decrement: 1,
          },
        },
      });

      if (
        referralCode &&
        eventWithId.eventPromotion.find(
          (ep) => ep.code === referralCode && ep.count > 0,
        )
      ) {
        await prisma.eventPromotion.update({
          where: {
            code: referralCode,
          },
          data: {
            count: {
              decrement: 1,
            },
          },
        });
      }

      if (points) {
        const deletePoint = await prisma.point.deleteMany({
          where: {
            userId: userWithId.id,
            id: {
              in: points,
            },
          },
        });
      }

      if (eventPromotionWithId) return { addTransaction };

      await prisma.eventPromotion.create({
        data: {
          userId: userWithId.id,
          eventId: eventWithId.id,
          code: generateEventReferralCode,
          count: 5,
          discount: 10000,
        },
      });

      return { addTransaction };
    });

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Order successfully',
      data: order.addTransaction,
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
