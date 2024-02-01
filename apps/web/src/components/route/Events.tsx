'use client';

import React, { useEffect, useState } from 'react';
import EventCard from '../event/EventCard';
import { PaginationDataResult } from '@/@types/event';
import { getAllEvents } from '@/services/event';
import { Button } from '../ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SkeletonCard } from '../SkeletonCard';
import { Input } from '../ui/input';
import { useDebouncedCallback } from 'use-debounce';
import axios from 'axios';

export default function Events() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { replace } = router;
  const [allEventData, setAllEventData] =
    useState<PaginationDataResult | null>();
  const [messageError, setMessageError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const currentPage = parseInt(searchParams?.get('page') || '1');
  const limit = parseInt(searchParams?.get('limit') || '10');
  const search = searchParams?.get('search') || '';
  const category = searchParams?.get('category') || '';

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/event/all-event?page=${currentPage}&limit=${limit}&search=${search}&category=${category}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((res) => {
        setIsLoading(false);
        setIsError(false);
        setMessageError('');
        setAllEventData(res.data.data);
      })
      .catch((err) => {
        setIsError(true);
        setIsLoading(false);
        setMessageError(err.response.data.message);
      });
  }, [currentPage, limit, search, category]);

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

  const handleCategory = (category: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('category', category);
    params.set('page', '1');
    params.set('search', search);

    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((search: string) => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
      params.set('page', '1');
      params.set('category', '');
    } else {
      params.delete('search');
    }

    replace(`${pathname}?${params.toString()}`);
  }, 1000);

  return (
    <div className="w-full p-4 border rounded-md">
      <div className="flex md:flex-row flex-col-reverse w-full justify-between gap-2 items-center pb-4">
        {allEventData?.categorys && (
          <div className="flex md:w-1/2 w-full h-10 gap-2 items-center overflow-x-auto scroll-category scroll-p-2">
            <Button
              onClick={() => handleCategory('')}
              variant={'outline'}
              className="flex h-7 font-light px-2 gap-1 text-sm"
            >
              All category
            </Button>
            {allEventData?.categorys.map((category, index) => (
              <Button
                onClick={() => handleCategory(category.category)}
                key={index}
                variant={'outline'}
                className="flex h-7 font-light px-2 gap-1 text-sm"
              >
                <span>{category.category}</span>
              </Button>
            ))}
          </div>
        )}
        <div
          className={`${
            allEventData ? 'md:w-1/2' : 'w-full'
          } w-full justify-end`}
        >
          <Input
            placeholder="Search events..."
            type="search"
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get('search')?.toString()}
            className="focus-visible:ring-1 h-10 focus-visible:ring-offset-0 focus-visible:ring-slate-400"
          />
        </div>
      </div>
      {isError ? (
        <div className="flex items-center text-center justify-center w-full h-[500px]">
          <p>{messageError}</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading ? <SkeletonCard /> : null}
          {allEventData?.events.map((event, index) => {
            return <EventCard key={index} event={event} />;
          })}
        </div>
      )}
      {isError ? null : (
        <div className="flex w-full gap-2 pt-4 items-center justify-center">
          <Button
            disabled={!allEventData?.hasPrevPage}
            onClick={handlePrevPage}
          >
            Prev page
          </Button>
          {allEventData?.prevPage && (
            <Button onClick={handlePrevPage}>{allEventData?.prevPage}</Button>
          )}
          <Button variant={'outline'}>{currentPage}</Button>
          {allEventData?.nextPage && (
            <Button onClick={handleNextPage}>{allEventData?.nextPage}</Button>
          )}
          <Button
            disabled={!allEventData?.hasNextPage}
            onClick={handleNextPage}
          >
            Next page
          </Button>
        </div>
      )}
    </div>
  );
}
