'use client';

import { Order } from '@/@types/analytics';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface OverviewProps {
  data: Order[] | undefined;
}

export function Overview(props: OverviewProps) {
  const { data } = props;
  let dataKey = 'hour';

  switch (data?.length) {
    case 12:
      dataKey = 'month';
      break;
    case 28:
      dataKey = 'day';
      break;
    case 29:
      dataKey = 'day';
      break;
    case 30:
      dataKey = 'day';
      break;
    case 31:
      dataKey = 'day';
      break;
    default:
      dataKey = 'hour';
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey={dataKey}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="count" fill="#000000" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
