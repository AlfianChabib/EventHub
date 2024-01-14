import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';

export interface updatePayload {
  name: string;
  username: string;
  image: string;
  phone: string;
}

export const getUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

    return res.status(200).json({
      code: 200,
      success: true,
      message: `User data with id ${id} fetched successfully`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, authToken } = req.body;

    const parsedId = parseInt(id);
    const { name, username, image, phone }: updatePayload = req.body;

    if (!parsedId || isNaN(parsedId)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Invalid ID, please provide a valid ID',
      });
    }

    const userWithId = await prisma.user.findFirst({
      where: {
        id: parsedId,
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
        id: parsedId,
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
    next(error);
  }
};
