'use client';
import { getEventByUserSession, getSessionClient } from '@/services/client';
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
} from "@/components/ui/table"

interface MainContentProps {
  sessionCookie: string | undefined;
}

export default function ProfileInfo(props: MainContentProps) {
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
      <h1 className="text-3xl font-semibold text-center flex items-center justify-center mb-5">List of your Events</h1>
      <div className="flex w-full">
          <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
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
            {eventData.map((event: any) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>{event.category}</TableCell>
                <TableCell>{event.startDate}</TableCell>
                <TableCell>{event.endDate}</TableCell>
                <TableCell>{event.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      </div>
    </div>
  );
}
