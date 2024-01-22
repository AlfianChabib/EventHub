import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const eventValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('price').notEmpty().isCurrency().withMessage('Price is required'),
  body('seats').notEmpty().withMessage('Seats is required'),
  body('startDate')
    .notEmpty()
    .isISO8601()
    .withMessage('Start Date is required'),
  body('endDate').notEmpty().isISO8601().withMessage('End Date is required'),
  body('duration').notEmpty().isString().withMessage('Duration is required'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
