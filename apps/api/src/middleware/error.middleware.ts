import { NextFunction, Request, Response } from 'express';

export const errorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err.stack);
  res.status(500).send(err.message);
};
