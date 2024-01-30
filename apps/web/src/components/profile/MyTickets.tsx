import React from 'react';
import { ProfileUser } from '@/services/client';
import TicketCard from '../event/TicketCard';

interface Props {
  sessionCookie?: string | undefined;
  profileUser?: ProfileUser | null;
}

export default function MyTickets(props: Props) {
  const { profileUser, sessionCookie } = props;

  const endedTickets = profileUser?.tickets.filter(
    (ticket) => new Date(ticket.eventDate) < new Date(),
  );

  const upcomingTickets = profileUser?.tickets.filter(
    (ticket) => new Date(ticket.eventDate) > new Date(),
  );

  return (
    <div className="flex flex-col w-full h-full md:px-2 px-1 rounded-md">
      <h1 className="text-xl md:text-2xl font-semibold text-center flex items-center justify-center my-3">
        Upcoming Events
      </h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {profileUser?.tickets.length === 0 && (
          <p className="text-center">You don`&apos;t have any tickets</p>
        )}
        {upcomingTickets?.map((ticket, index) => {
          return <TicketCard key={index} ticket={ticket} />;
        })}
      </div>
      <h1 className="text-xl md:text-2xl font-semibold text-center flex items-center justify-center my-3">
        Ended Events
      </h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {profileUser?.tickets.length === 0 && (
          <p className="text-center">You don`&apos;t have any tickets</p>
        )}
        {endedTickets?.map((ticket, index) => {
          return (
            <TicketCard
              key={index}
              ticket={ticket}
              isEnded={true}
              sessionCookie={sessionCookie}
            />
          );
        })}
      </div>
    </div>
  );
}
