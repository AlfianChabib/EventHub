'use client';

import React, { useEffect, useState } from 'react';
import { EventData } from '@/app/event/[id]/page';
import {
  ProfileUser,
  SessionData,
  getProfileUser,
  getSessionClient,
} from '@/services/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select } from '../ui/select';

interface Props {
  eventData: EventData;
  sessionCookie: string | undefined;
}

interface OrderData {
  ticketTierId?: number;
  referralCode?: string;
  voucherId?: number;
  point: number;
  eventId: number;
}

export default function TicketOrder(props: Props) {
  const { eventData, sessionCookie } = props;

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [openOrder, setOpenOrder] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<OrderData>({
    point: 0,
    voucherId: 0,
    referralCode: '',
    ticketTierId: 0,
    eventId: eventData.id,
  });

  useEffect(() => {
    getSessionClient(sessionCookie).then((data) => {
      if (data) setSessionData(data);
    });
  }, [sessionCookie]);

  useEffect(() => {
    if (sessionData) {
      getProfileUser(sessionCookie).then((data) => {
        if (data) setProfileUser(data);
      });
    }
  }, [sessionCookie, sessionData]);

  console.log(profileUser);
  console.log(eventData);

  const formatPrice = (price: number) => {
    return price.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
  };

  const checkDiscount = (price: number) => {
    if (eventData.discount.discount > 0) {
      let result = price - eventData.discount.discount;
      return formatPrice(result);
    }
    return formatPrice(price);
  };

  const handleOrder = () => {
    console.log(orderData);
  };

  return (
    <div className="flex md:relative absolute bottom-0 flex-col md:max-w-96 w-full border rounded-xl p-2 gap-2">
      <div className="flex text-lg font-bold">
        {eventData.discount.discount > 0 ? (
          <div className="flex w-full gap-2 items-center justify-center">
            <p className="text-emerald-800">{checkDiscount(eventData.price)}</p>
            <span className="text-xs text-foreground/60 line-through">
              {formatPrice(eventData.price)}
            </span>
          </div>
        ) : (
          <p>{formatPrice(eventData.price)}</p>
        )}
      </div>
      {!sessionData ? (
        <Button className="text-lg text-center font-semibold">
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
        <div className="flex flex-col w-full border p-2 gap-2 rounded-md">
          <h2 className="font-semibold">Select a ticket</h2>
          <RadioGroup defaultValue="normal-price">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={
                  checkDiscount(eventData.price)?.toString() || 'normal-price'
                }
                id="normal-price"
                onClick={() =>
                  setOrderData({
                    ...orderData,
                    ticketTierId: 0,
                  })
                }
              />
              <Label
                htmlFor="normal-price"
                className="flex w-full justify-between"
              >
                <p>Normal ticket</p>
                <p className="text-end">{checkDiscount(eventData.price)}</p>
              </Label>
            </div>
            {eventData.TicketTier.map((tier, index) => (
              <div className="flex items-center space-x-2" key={index}>
                <RadioGroupItem
                  value={tier.id.toString()}
                  id={tier.id.toString()}
                  onClick={() =>
                    setOrderData({
                      ...orderData,
                      ticketTierId: tier.id,
                    })
                  }
                />
                <Label
                  htmlFor={tier.id.toString()}
                  className="flex w-full justify-between"
                >
                  <p>{tier.nameTier} ticket</p>
                  <p>{checkDiscount(tier.price)}</p>
                </Label>
              </div>
            ))}
          </RadioGroup>
          <form>
            <Label className="font-semibold">Promotion code (optional)</Label>
            <div className="flex items-center space-x-2">
              <Input type="text" placeholder="Enter Promotion code" />
              <Button type="submit">Apply</Button>
            </div>
          </form>
          <Button onClick={handleOrder}>Order ticket</Button>
        </div>
      ) : null}
    </div>
  );
}
