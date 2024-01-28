import React from 'react';
import EventCard from '../event/EventCard';
import { ProfileUser } from '@/services/client';
import TicketCard from '../event/TicketCard';

interface Props {
  sessionCookie?: string | undefined;
  profileUser?: ProfileUser | null;
}

export default function MyTickets(props: Props) {
  const { sessionCookie, profileUser } = props;
  return (
    <div className="w-full px-4 border rounded-md">
      <h1 className="text-3xl font-semibold text-center flex items-center justify-center my-10">
        Upcoming Events
      </h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {profileUser?.tickets.length === 0 && (
          <p className="text-center">You don`&apos;t have any tickets</p>
        )}
        {profileUser?.tickets?.map((ticket, index) => {
          return <TicketCard key={index} ticket={ticket} />;
        })}
      </div>
    </div>
  );
}
