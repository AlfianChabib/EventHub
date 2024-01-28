'use client';

import React, { useEffect, useState } from 'react';
import EventCard from '../event/EventCard';
import { EventData } from '@/@types/event';
import { getAllEvents } from '@/services/event';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface EventProps {
  eventData: EventData[];
}

export default function Events(props: EventProps) {
  const { eventData } = props;
  const router = useRouter();
  const [allEventData, setAllEventData] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    getAllEvents(page, limit).then((result) => {
      console.log(result.data);
      setAllEventData(result.data);
    });
  }, [page, limit]);

  const handleNext = () => {
    setPage(page + 1);
  };

  // console.log(eventData);

  return (
    <div className="w-full p-4 border rounded-md">
      <h1 className="text-3xl font-semibold text-center flex items-center justify-center my-4">
        Upcoming Events
      </h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {eventData?.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
      {/* <br />
      <h1 className="text-3xl font-semibold text-center flex items-center justify-center my-4">
        Previous Events
      </h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
      </div> */}

      <div>
        {/* buatkan saya pagination dengan menggunakan button */}
        <Button onClick={handleNext}>Load More</Button>
      </div>
    </div>
  );
}
