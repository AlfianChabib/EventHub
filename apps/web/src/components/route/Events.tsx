import React from 'react';
import EventCard from '../event/EventCard';

export default function Events() {
  return (
    <div className="w-full p-4 border rounded-md">
      <h1 className="text-3xl font-semibold text-center flex items-center justify-center my-10">
            Upcoming Events
          </h1>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4">
            <EventCard />
            <EventCard />
            <EventCard />
            <EventCard />
          </div>
          <br />
          <h1 className="text-3xl font-semibold text-center flex items-center justify-center my-10">
            Previous Events
          </h1>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4">
            <EventCard />
            <EventCard />
            <EventCard />
            <EventCard />
          </div>
    </div>
  );
}
