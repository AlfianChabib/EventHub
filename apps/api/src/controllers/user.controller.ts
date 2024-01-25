import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';

export interface updatePayload {
  name: string;
  username: string;
  image: string;
  phone: string;
}

export const getUserId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);

    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Invalid ID, please provide a valid ID',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: parsedId,
      },
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: `User with id ${id} not found`,
      });
    }

    const { password } = user;

    return res.status(200).json({
      code: 200,
      success: true,
      message: `User data with id ${id} fetched successfully`,
      data: {
        ...user,
        password: null,
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

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    const { name, username, image, phone }: updatePayload = req.body;

    const userWithId = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!userWithId) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: `User with id ${id} not found`,
      });
    }

    const userUpdate = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        username,
        image,
        phone,
      },
    });

    return res.status(200).json({
      code: 200,
      success: true,
      message: `User with id ${id} updated successfully`,
      data: userUpdate,
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

export const getVoucher = async (req: Request, res: Response) => {
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

    const voucher = await prisma.voucher.findMany({
      where: {
        userId: parsedId,
      },
    });

    if (!voucher) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Voucher not found',
      });
    }

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Voucher retrieved successfully',
      data: voucher,
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

export const getPoint = async (req: Request, res: Response) => {
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

    const point = await prisma.point.findMany({
      where: {
        userId: parsedId,
      },
    });

    if (!point) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Point not found',
      });
    }

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Point retrieved successfully',
      data: point,
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

export const getEventPromotion = async (req: Request, res: Response) => {
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

    const eventPromotion = await prisma.eventPromotion.findMany({
      where: {
        userId: parsedId,
      },
    });

    if (!eventPromotion) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Event promotion not found',
      });
    }

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Event promotion retrieved successfully',
      data: eventPromotion,
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
