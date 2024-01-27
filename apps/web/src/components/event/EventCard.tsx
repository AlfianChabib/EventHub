import React from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../ui/card';
import Image from "next/image";
import HeroImage from '/public/assets/concert1.jpg';

export default function EventCard() {
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Image
          src={HeroImage}
          width={500}
          height={300}
          objectFit="contain"
          className="rounded w-full"
          alt=""
        />
        </CardHeader>
        <CardContent>
          <div>
            <div className="text-2xl font-bold mb-5">Event Title</div>
          </div>
          <p className="text-sm font-medium mb-5">Category</p>
          <p className="text-sm font-medium">
            Description : Lorem ipsum dolor sit amet consectetur adipisicing
            elit.
          </p>
        </CardContent>
        <CardContent className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Date</CardTitle>
          <CardTitle className="text-sm font-medium">Location</CardTitle>
        </CardContent>
        <CardContent className="flex flex-row items-center justify-between space-y-0 pb-5">
          <CardTitle className="text-sm font-medium">Time</CardTitle>
          <CardTitle className="text-sm font-bold">Price</CardTitle>
        </CardContent>
      </Card>
    </div>
  );
}
