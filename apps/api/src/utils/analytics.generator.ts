import prisma from '@/prisma';

export interface MonthData {
  month: string;
  count: number;
}

export interface DayData {
  day: string;
  count: number;
}

export interface HourData {
  hour: string;
  count: number;
}

export async function generateLast12MonthsData(
  userId: number,
  eventId: number,
): Promise<{
  last12Months: MonthData[];
}> {
  const last12Months: MonthData[] = [];
  const currentDate = new Date();
  currentDate.setDate(1); // Set to the first day of the current month

  for (let i = 11; i >= 0; i--) {
    const endDate = new Date(currentDate);
    endDate.setMonth(endDate.getMonth() + 1, 0); // Set to the last day of the current month

    const startDate = new Date(currentDate);

    const monthYear = `${startDate.toLocaleString('default', {
      month: 'short',
    })} ${startDate.getFullYear()}`;

    const count = await prisma.transaction.count({
      where: {
        eventId: eventId,
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    last12Months.push({ month: monthYear, count });

    // Move to the previous month
    currentDate.setMonth(currentDate.getMonth() - 1);
  }

  return { last12Months };
}

export async function generateCurrentMonthData(
  userId: number,
  eventId: number,
): Promise<{
  currentMonthData: DayData[];
}> {
  const currentMonthData: DayData[] = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get the total number of days in the current month
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let day = 1; day <= lastDay; day++) {
    const startDate = new Date(currentYear, currentMonth, day);
    const endDate = new Date(currentYear, currentMonth, day + 1);

    const dayOfMonth = startDate.toLocaleString('default', { day: 'numeric' });

    const count = await prisma.transaction.count({
      where: {
        eventId: eventId,
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    currentMonthData.push({ day: dayOfMonth, count });
  }

  return { currentMonthData };
}

export async function generateCurrentDayData(
  userId: number,
  eventId: number,
): Promise<{
  currentDayData: HourData[];
}> {
  const currentDayData: HourData[] = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  for (let hour = 0; hour < 24; hour++) {
    const startDate = new Date(currentYear, currentMonth, currentDay, hour);
    const endDate = new Date(currentYear, currentMonth, currentDay, hour + 1);

    const hourOfDay = startDate.toLocaleString('default', {
      hour: 'numeric',
      hour12: false,
    });

    const count = await prisma.transaction.count({
      where: {
        eventId: eventId,
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    currentDayData.push({ hour: hourOfDay, count });
  }

  return { currentDayData };
}
