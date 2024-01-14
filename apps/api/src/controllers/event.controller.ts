import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.body;
    res.send('hello event');
  } catch (error) {
    next(error);
  }
};
