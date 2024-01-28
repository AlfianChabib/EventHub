import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import EventCard from '../event/EventCard';
import HeroImage from '/public/assets/concert1.jpg';

export default function Hero() {
  return (
    <>
      <section className="">
        <div className="w-full h-[500px]">
          <Image
            src={HeroImage}
            alt="hero-image"
            width={2000}
            height={2000}
            priority
            objectFit="cover"
            className="w-full h-full rounded-md object-cover object-center"
          />
        </div>
        <div className="flex items-center justify-center my-4">
          <h1 className="text-xl font-semibold text-center">
            Host, Connect, Celebrate: Your Events, With Our Platform!
          </h1>
        </div>
      </section>
      <section className="flex flex-col">
        <div className="w-full px-4 border rounded-md">
          <h1 className="text-3xl font-semibold text-center flex items-center justify-center my-4">
            Explore the Journey with Us!
          </h1>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <EventCard />
            <EventCard />
            <EventCard />
            <EventCard />
            <EventCard />
            <EventCard />
            <EventCard />
            <EventCard />
          </div>
          <div className="flex items-center justify-center my-10">
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="/events">Explore Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
