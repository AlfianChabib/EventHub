'use client';
import {
  EventDataResponse,
  ProfileUser,
  getSessionClient,
} from '@/services/client';
import React, { useEffect, useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface MainContentProps {
  sessionCookie: string | undefined;
  profileUser: ProfileUser | null;
}

export default function MyEvents(props: MainContentProps) {
  const { sessionCookie, profileUser } = props;
  const [sessionData, setSessionData] = useState<any>({});
  const { event } = sessionData;

  useEffect(() => {
    getSessionClient(sessionCookie).then((data) => {
      if (data) setSessionData(data);
    });
  }, [sessionCookie]);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center flex items-center justify-center mb-5">
        My Events List
      </h1>
      <div className="flex w-full">
        <Table>
          <TableCaption>A list of your events.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {event?.map((event: any) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>{event.category}</TableCell>
                <TableCell>{formatDate(event.startDate)}</TableCell>
                <TableCell>{formatDate(event.endDate)}</TableCell>
                <TableCell>{event.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
