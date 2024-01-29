'use client';

import React, { useEffect, useState } from 'react';
import EventCard from '../event/EventCard';
import { PaginationDataResult } from '@/@types/event';
import { getAllEvents } from '@/services/event';
import { Button } from '../ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Events() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { replace } = router;
  const [allEventData, setAllEventData] =
    useState<PaginationDataResult | null>();

  const currentPage = parseInt(searchParams?.get('page') || '1');
  const limit = parseInt(searchParams?.get('limit') || '10');
  console.log(currentPage);

  useEffect(() => {
    getAllEvents(currentPage, limit).then((result) => {
      console.log(result);
      setAllEventData(result);
    });
  }, [currentPage, limit]);

  const handleNextPage = () => {
    const params = new URLSearchParams(searchParams);
    if (allEventData?.hasNextPage === false) return;
    params.set('page', (currentPage + 1).toString());
    params.set('limit', limit.toString());

    replace(`${pathname}?${params.toString()}`);
  };

  const handlePrevPage = () => {
    const params = new URLSearchParams(searchParams);
    if (allEventData?.hasPrevPage === false) return;
    params.set('page', (currentPage - 1).toString());
    params.set('limit', limit.toString());

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full p-4 border rounded-md">
      <h1 className="text-3xl font-semibold text-center flex items-center justify-center my-4">
        Upcoming Events
      </h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {allEventData?.events?.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>

      <div className="flex w-full gap-2 pt-4 items-center justify-center">
        <Button disabled={!allEventData?.hasPrevPage} onClick={handlePrevPage}>
          Prev page
        </Button>
        {allEventData?.prevPage && (
          <Button onClick={handlePrevPage}>{allEventData?.prevPage}</Button>
        )}
        <Button variant={'outline'}>{currentPage}</Button>
        {allEventData?.nextPage && (
          <Button onClick={handleNextPage}>{allEventData?.nextPage}</Button>
        )}
        <Button disabled={!allEventData?.hasNextPage} onClick={handleNextPage}>
          Next page
        </Button>
      </div>
    </div>
  );
}
