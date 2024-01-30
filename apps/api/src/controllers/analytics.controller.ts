import { Request, Response } from 'express';
import prisma from '@/prisma';
import { generateCurrentDayData, generateCurrentMonthData, generateLast12MonthsData } from '../utils/analytics.generator';

export const getOrderAnalyticsYear = async (req: Request, res: Response) => {
  try {
    const order = await generateLast12MonthsData();
    res.status(200).json({
      success: true,
      order,
    });
    console.log(generateLast12MonthsData())
  } catch (error) {
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getOrderAnalyticsMonth = async (req: Request, res: Response) => {
    try {
      const order = await generateCurrentMonthData();
      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        success: false,
        message: 'Internal server error',
      });
    }
  };
  
  export const getOrderAnalyticsDay = async (req: Request, res: Response) => {
    try {
      const order = await generateCurrentDayData();
      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        success: false,
        message: 'Internal server error',
      });
    }
  };