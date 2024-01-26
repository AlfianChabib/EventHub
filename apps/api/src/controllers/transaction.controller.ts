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
        const voucher = userWithId.voucher.find((v) => v.id === voucherId);

        if (voucher) {
          result = result - 10000;
        }
      }

      if (points) {
        points.forEach((p) => {
          userWithId.point.forEach((point) => {
            if (point.id === p) {
              result = result - 10000;
            }
          });
        });
      }

      if (referralCode) {
        eventWithId.eventPromotion.forEach((ep) => {
          if (ep.code === referralCode) {
            result -= 10000;
          }
        });
      }

      if (eventWithId.discount) {
        result -= eventWithId.discount.discount;
      }

      return result;
    };

    const generateEventReferralCode = generateReferral(eventWithId.title);

    // if (!points && !voucherId && !referralCode && !ticketTierId) {
    //   const order = await prisma.$transaction(async (prisma) => {
    //     const addTransaction = await prisma.transaction.create({
    //       data: {
    //         userId: userWithId.id,
    //         eventId: eventId,
    //         totalAmount: calcTotalAmount(),
    //       },
    //     });

    //     const addTicket = await prisma.ticket.create({
    //       data: {
    //         userId: userWithId.id,
    //         eventId: eventId,
    //         eventTitle: eventWithId.title,
    //         eventDate: eventWithId.startDate,
    //       },
    //     });

    //     const addEventPromotion = await prisma.eventPromotion.create({
    //       data: {
    //         userId: userWithId.id,
    //         eventId: eventId,
    //         code: generateEventReferralCode,
    //         count: 5,
    //         discount: 10000,
    //       },
    //     });

    //     const updateEvent = await prisma.event.update({
    //       where: {
    //         id: eventWithId.id,
    //       },
    //       data: {
    //         seats: eventWithId.seats - 1,
    //       },
    //     });

    //     return {
    //       addTransaction,
    //       addTicket,
    //       addEventPromotion,
    //       updateEvent,
    //     };
    //   });

    //   return res.status(200).json({
    //     code: 200,
    //     success: true,
    //     message: 'Order successfully',
    //     data: order.addTransaction,
    //   });
    // }

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

      const updateEvent = await prisma.event.update({
        where: {
          id: eventWithId.id,
        },
        data: {
          seats: eventWithId.seats - 1,
        },
      });

      if (
        referralCode &&
        eventWithId.eventPromotion.find((ep) => ep.code === referralCode)
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
