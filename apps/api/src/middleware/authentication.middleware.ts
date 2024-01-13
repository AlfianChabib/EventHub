import { verifyToken } from '@/common/helpers/jwt.helper';
import { NextFunction, Request, Response } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(403).json({
      code: 403,
      message: 'You are not allowed to access this endpoint',
    });
  }

  const userToken = authToken.split(' ')[1];
  if (!userToken) {
    return res.status(403).json({
      code: 403,
      message: 'You are not allowed to access this endpoint',
    });
  }

  const verifyTokenResult = verifyToken(userToken);

  if (!verifyTokenResult.isValid) {
    return res.status(403).json({
      code: 403,
      message: 'Invalid Token',
    });
  }

  const { id, username, email, role } = verifyTokenResult.data;

  const isAdmin = role === 'admin';
  // req.userId = id;
  // req.username = username;
  // req.userEmail = email;
  // req.isAdmin = role === 'admin';
  // req.authToken = authToken;
  // req.cookie = cookieToken;

  req.body = { id, username, email, isAdmin, authToken };

  next();
};
