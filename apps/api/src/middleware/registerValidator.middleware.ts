import { Response, Request, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const registerValidator = [
  body('name')
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage('Name is required, at least 3 characters long'),
  body('username')
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage('Username is required, at least 3 characters long'),
  body('email').isEmail().withMessage('Email is required'),
  body('password')
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage('Password is required, at least 8 characters long'),
  body('referralCode'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
