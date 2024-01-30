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
      <h1 className="text-3xl font-semibold text-center flex items-center justify-center mb-5">
        My Tickets
      </h1>
      <h1 className="text-xl md:text-2xl font-semibold text-center flex items-center justify-center my-5">
        Upcoming Events
      </h1>
      <div className="flex flex-col items-center justify-center w-full px-4 border rounded-md min-h-[200px]">
        {profileUser?.tickets.length === 0 && (
          <p className="text-center">
            You don&apos;t have any tickets
          </p>
        )}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {upcomingTickets?.map((ticket, index) => {
            return <TicketCard key={index} ticket={ticket} />;
          })}
        </div>
      </div>
      <h1 className="text-xl md:text-2xl font-semibold text-center flex items-center justify-center my-5">
        Previous Events
      </h1>
      <div className="flex flex-col items-center justify-center w-full px-4 border rounded-md min-h-[200px]">
          {profileUser?.tickets.length === 0 && (
            <p className="text-center">You don&apos;t have any tickets</p>
          )}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}
