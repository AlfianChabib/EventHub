import React from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../ui/card';
import Image from 'next/image';
import HeroImage from '/public/assets/concert1.jpg';
import { ProfileUser, Ticket } from '@/services/client';

interface Props {
  profileUser?: ProfileUser | null;
  ticket?: Ticket | null;
}

export default function TicketCard(props: Props) {
  const { profileUser, ticket } = props;

  if (!ticket) {
    return null;
  }

  const eventDate = new Date(ticket.eventDate).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const eventTime = new Date(ticket.eventDate).toLocaleTimeString('id-ID', {
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{ticket.eventTitle}</CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit amet consectetur
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{eventDate}</CardTitle>
          <CardTitle className="text-sm font-medium">Location</CardTitle>
        </CardContent>
        <CardContent className="flex flex-row items-center justify-between space-y-0 pb-5">
          <CardTitle className="text-sm font-medium">{eventTime}</CardTitle>
        </CardContent>
      </Card>
    </div>
  );
}
