'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Overview } from '../Overview';
import axios from 'axios';
import { Analytics } from '@/@types/analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface Props {
  overviewEventId: number;
  sessionCookie: string | undefined;
}

export default function OverviewEvent(props: Props) {
  const { overviewEventId, sessionCookie } = props;
  const [analytics, setAnalytics] = useState<Analytics>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/analytics/all/${overviewEventId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionCookie}`,
        },
      })
      .then((res) => {
        setAnalytics(res.data.data);
        setLoading(false);
      });
  }, [overviewEventId, sessionCookie]);

  console.log(analytics);

  return (
    <div className="flex flex-col w-full ">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Card className="w-full">
          <Tabs>
            <TabsList defaultValue="orderDay">
              <TabsTrigger value="orderDay">Days Range</TabsTrigger>
              <TabsTrigger value="orderMonth">Month Range</TabsTrigger>
              <TabsTrigger value="orderYear">Year Range</TabsTrigger>
            </TabsList>
            <TabsContent value="orderDay">
              <CardContent className="pl-2">
                <Overview data={analytics?.orderDay} />
              </CardContent>
            </TabsContent>
            <TabsContent value="orderMonth">
              <CardContent className="pl-2">
                <Overview data={analytics?.orderMonth} />
              </CardContent>
            </TabsContent>
            <TabsContent value="orderYear">
              <CardContent className="pl-2">
                <Overview data={analytics?.orderYear} />
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
}
