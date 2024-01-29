'use client';

import React, { useEffect, useState } from 'react';
import { EventData } from '@/app/event/[id]/page';
import { ProfileUser, getProfileUser } from '@/services/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { orderTransaction } from '@/services/transaction';

interface Props {
  eventData: EventData;
  sessionCookie: string | undefined;
}

export interface OrderData {
  ticketTierId?: number;
  referralCode?: string;
  voucherId?: number;
  points?: number[];
  eventId: number;
}

interface Alert {
  message: string;
  status: boolean;
}

export default function TicketOrder(props: Props) {
  const { eventData, sessionCookie } = props;

  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [openOrder, setOpenOrder] = useState<boolean>(false);
  const [openPoint, setOpenPoint] = useState<boolean>(false);
  const [alert, setAlert] = useState<Alert>({
    message: '',
    status: false,
  });
  const [orderData, setOrderData] = useState<OrderData>({
    points: [],
    voucherId: 0,
    referralCode: '',
    ticketTierId: 0,
    eventId: eventData.id,
  });

  useEffect(() => {
    if (sessionCookie) {
      getProfileUser(sessionCookie).then((data) => {
        if (data) setProfileUser(data);
      });
    }
  }, [sessionCookie]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
  };

  const checkDiscount = (price: number) => {
    if (eventData.discount) {
      let result = price - eventData.discount.discount;
      return formatPrice(result);
    }
    return formatPrice(price);
  };

  const handlePoint = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      point: { value: number };
    };

    let result: number[] = [];
    profileUser?.point.forEach((pointuser) => {
      if (result.length < target.point.value) {
        result.push(pointuser.id);
      }
    });
    setOrderData({ ...orderData, points: result });
  };

  const handlePromotion = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      promotion: { value: string };
    };
    setOrderData({ ...orderData, referralCode: target.promotion.value });
  };

  const handleOrder = async () => {
    try {
      const orderResult = await orderTransaction(orderData, sessionCookie);

      if (orderResult.code === 200) {
        console.log(orderResult);
        return orderResult;
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!profileUser && !sessionCookie) return null;

  return (
    <div className="flex md:relative absolute bottom-0 bg-background flex-col md:max-w-96 w-full border rounded-xl p-2 gap-2">
      <div className="flex text-lg font-bold">
        {eventData.discount ? (
          <div className="flex w-full gap-2 items-center justify-center">
            <p className="text-emerald-800">{checkDiscount(eventData.price)}</p>
            <span className="text-xs text-foreground/60 line-through">
              {formatPrice(eventData.price)}
            </span>
          </div>
        ) : (
          <p className="w-full text-center">{formatPrice(eventData.price)}</p>
        )}
      </div>
      {!sessionCookie ? (
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
      {openOrder && sessionCookie ? (
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

            {eventData.TicketTier &&
              eventData.TicketTier.map((tier, index) => (
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
          {!openPoint ? (
            <div className="flex w-full justify-between items-center py-2">
              <p className="font-semibold text-slate-700">
                You have {profileUser?.point.length} point
              </p>
              {profileUser?.point ? (
                <Button onClick={() => setOpenPoint(!openPoint)}>
                  Use point
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col w-full justify-between gap-2 py-2">
              <p className="font-semibold">Point</p>
              <form onSubmit={handlePoint} className="flex w-full gap-2">
                <input
                  type="number"
                  name="point"
                  defaultValue={profileUser?.point.length}
                  min={0}
                  max={profileUser?.point.length}
                  className="w-full rounded-lg px-2"
                />
                <Button type="submit">Apply</Button>
              </form>
            </div>
          )}

          {!profileUser?.voucher ? (
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Voucher" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {profileUser?.voucher.map((voucher, index) => (
                    <SelectItem
                      value={voucher.id.toString()}
                      key={index}
                      onClick={() =>
                        setOrderData({ ...orderData, voucherId: voucher.id })
                      }
                    >
                      Voucher {voucher.id}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            <p className="font-semibold text-slate-700">
              You have {profileUser?.voucher.length} voucher
            </p>
          )}
          <form onSubmit={handlePromotion}>
            <Label className="font-semibold">Promotion code (optional)</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                name="promotion"
                placeholder="Enter Promotion code"
              />
              <Button type="submit">Apply</Button>
            </div>
          </form>

          <Button onClick={handleOrder}>Order ticket</Button>
        </div>
      ) : null}
    </div>
  );
}
