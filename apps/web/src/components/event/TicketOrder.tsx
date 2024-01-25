'use client';

import React, { useEffect, useState } from 'react';
import { EventData, TicketTier } from '@/app/event/[id]/page';
import { SessionData, getSessionClient } from '@/services/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Props {
  eventData: EventData;
  sessionCookie: string | undefined;
}

export default function TicketOrder(props: Props) {
  const { eventData, sessionCookie } = props;

  const [openOrder, setOpenOrder] = useState<boolean>(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [selectTicket, setSelectTicket] = useState<unknown>();

  useEffect(() => {
    getSessionClient(sessionCookie).then((data) => {
      if (data) setSessionData(data);
    });
  }, [sessionCookie]);

  useEffect(() => {
    if (eventData.discount.discount > 0) {
      setCurrentPrice(eventData.price - eventData.discount.discount);
    } else {
      setCurrentPrice(eventData.price);
    }
  }, [eventData]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
  };
  const normalPrice = formatPrice(eventData.price);
  const formatedCurrentPrice = formatPrice(currentPrice);

  return (
    <div className="flex md:relative absolute bottom-0 flex-col md:max-w-96 w-full border rounded-xl p-2 gap-2">
      <div className="flex text-lg font-bold">
        {eventData.discount.discount > 0 ? (
          <div className="flex w-full gap-2 items-center justify-center">
            <p className="text-emerald-800">{formatedCurrentPrice}</p>
            <span className="text-xs text-foreground/60 line-through">
              {normalPrice}
            </span>
          </div>
        ) : (
          <p>{normalPrice}</p>
        )}
      </div>
      {!sessionData ? (
        <Button className="text-lg text-foreground/80 text-center font-bold">
          <Link className="w-full" href="/auth/signin">
            Login to order tickets
          </Link>
        </Button>
      ) : (
        <Button
          onClick={() => setOpenOrder(!openOrder)}
          className="text-lg text-center font-semibold"
        >
          {openOrder ? 'Close order' : 'Order now'}
        </Button>
      )}
      {openOrder ? (
        <div className="flex flex-col w-full border p-2 rounded-md">
          <h1 className="text-lg font-semibold">Tickets</h1>
          <div className="flex flex-col py-2 gap-2">
            <div className="flex flex-col w-full rounded-sm border">
              <div className="flex w-full justify-between items-center bg-slate-200 py-1 px-2">
                <p className="font-semibold">General ticket</p>
                <Button className="h-8">Select</Button>
              </div>
              <p className="py-1 px-2">{formatPrice(currentPrice)}</p>
            </div>
            {eventData.TicketTier.map((ticket, index) => (
              <div
                className="flex flex-col w-full rounded-sm border"
                key={index}
              >
                <div className="flex w-full justify-between items-center bg-slate-200 py-1 px-2">
                  <p className="font-semibold">{ticket.nameTier} </p>
                  <Button className="h-8">Select</Button>
                </div>
                <p className="py-1 px-2">
                  {formatPrice(ticket.price - eventData.discount.discount)}
                </p>
              </div>
            ))}
          </div>
          <Button>Buy</Button>
        </div>
      ) : null}
    </div>
  );
}
