import { generateReferral } from '@/common/helpers/referral.helper';
import prisma from '@/prisma';
import { Request, Response } from 'express';

interface InputPayload {
  eventId: number;
  quantity: number;
  count: number;
  pointId?: number;
  voucherId?: number;
  eventReferralCode?: string;
  ticketTierId?: number;
}

export const orderEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const {
      eventId,
      quantity,
      count,
      pointId,
      voucherId,
      eventReferralCode,
      ticketTierId,
    }: InputPayload = req.body;
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
        id: eventId,
      },
    });

    if (!eventWithId) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Event not found',
      });
    }

    const generateEventReferralCode = generateReferral(eventWithId.title);

    const expiredEvent = new Date(eventWithId.startDate).getTime();
    if (expiredEvent < new Date().getTime()) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Event has expired',
      });
    }

    if (!pointId && !voucherId && !eventReferralCode && !ticketTierId) {
      const order = await prisma.$transaction(async (prisma) => {
        await prisma.transaction.create({
          data: {
            userId: userWithId.id,
            eventId: eventId,
            totalAmount: quantity,
          },
        });

        if (count > 1) {
          await prisma.ticket.createMany({
            data: Array(count).fill({
              userId: userWithId.id,
              eventId: eventId,
              eventTitle: eventWithId.title,
              eventDate: eventWithId.startDate,
            }),
          });
        }

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

    // const pointWithId = await prisma.point.findMany({
    //   where: {
    //     id: parsedId,
    //   },
    // });

    // const voucherWithId = await prisma.voucher.findUnique({
    //   where: {
    //     id: voucherId,
    //   },
    // });

    // const ticketTierWithId = await prisma.ticketTier.findUnique({
    //   where: {
    //     id: ticketTierId,
    //   },
    // });

    // const eventReferralCodeWithId = await prisma.eventPromotion.findUnique({
    //   where: {
    //     code: eventReferralCode,
    //   },
    // });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Internal server error',
    });
  }
};
