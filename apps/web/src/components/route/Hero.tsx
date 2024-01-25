import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import EventCard from '../event/EventCard';

export default function Hero() {
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain md:pb-10">
        <div className="mb-10">
          <Image
            src="/assets/hero.jpg"
            alt="hero"
            width={2000}
            height={2000}
            className="max-h-[100vh] 2xl:max-h-[100vh]"
          />
        </div>
        <div className="flex items-center justify-center">
          <h1 className="h1-bold">
            Host, Connect, Celebrate: Your Events, With Our Platform!
          </h1>
        </div>
      </section>
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        {/* <h2 className="h2-bold">
          Trust by <br /> Thousands of Events
        </h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          Search Category Filter
        </div> */}
        <h1 className="text-3xl font-semibold text-center flex items-center justify-center mb-5">
          Explore the Journey with Us!
        </h1>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4">
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
        </div>
        <div className="flex items-center justify-center">
          <Button size="lg" asChild className="button w-full sm:w-fit">
            <Link href="#events">Explore Now</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
