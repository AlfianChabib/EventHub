'use client';
import {
  EventDataResponse,
  Point,
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

export default function MyPoints(props: MainContentProps) {
  const { sessionCookie, profileUser } = props;

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  if (!profileUser) {
    return <div>Loading...</div>;
  }
  const { point } = profileUser;

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center flex items-center justify-center mb-5">
        My Points
      </h1>
      <div className="flex w-full">
        <Table>
          <TableCaption>A list of your points.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Expire Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {point?.map((point: Point) => (
              <TableRow key={point.id}>
                <TableCell className="font-medium">{point.id}</TableCell>
                <TableCell>{formatDate(point.expireDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
