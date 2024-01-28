import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import Image from 'next/image';
import HeroImage from '/public/assets/concert1.jpg';
import { Separator } from '../ui/separator';
import { EventData } from '@/@types/event';

interface EventCardProps {
  event: EventData;
}

export default function EventCard(props: EventCardProps) {
  const { event } = props;

  const eventDate = new Date(event.startDate).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
  };

  return (
    <div>
      <Card className="flex flex-col rounded-lg overflow-hidden">
        <CardHeader className="flex relative p-0">
          <Image
            src={event.image || HeroImage}
            width={500}
            height={300}
            className="w-full object-cover rounded-lg"
            alt={event.title}
            priority
          />
          <p className="absolute bottom-2 left-2 text-slate-900 text-sm font-semibold py-1 px-2 bg-white/90 rounded-md">
            {event.category}
          </p>
        </CardHeader>
        <CardContent className="px-2 py-2">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold leading-6">{event.title}</h2>
            <p className="text-sm font-medium text-slate-700 leading-4 text-ellipsis h-[60px]">
              {event.description}
            </p>
          </div>
        </CardContent>
        <Separator />
        <CardContent className="flex justify-between px-2 py-2 ">
          <p className="text-sm font-medium">{event.location}</p>
          <p className="text-sm font-medium">{eventDate}</p>
        </CardContent>
        <p className="text-sm p-2 font-bold text-slate-900">
          {event.price > 0 ? formatPrice(event.price) : 'Free'}
        </p>
      </Card>
    </div>
  );
}
