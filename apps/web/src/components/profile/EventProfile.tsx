'use client';
import { getEventByUserSession, getSessionClient } from '@/services/client';
import React, { useEffect, useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface MainContentProps {
  sessionCookie: string | undefined;
}

export default function EventProfile(props: MainContentProps) {
  const { sessionCookie } = props;
  const [sessionData, setSessionData] = useState<any>({});
  const [eventData, setEventData] = useState<any>([]);

  useEffect(() => {
    getEventByUserSession(sessionCookie).then((data) => {
      if (data) setEventData(data);
    });
  }, [sessionCookie]);

  useEffect(() => {
    getSessionClient(sessionCookie).then((data) => {
      if (data) setSessionData(data);
    });
  }, [sessionCookie]);

  console.log(eventData);
  return (
    <div>
      <h1>EventProfile</h1>
      <div className="flex w-full">
        {eventData.map((event: any) => (
          <Card className="w-full max-w-[400px]" key={event.id}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
