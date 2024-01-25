import TicketOrder from '@/components/event/TicketOrder';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { SessionData } from '@/services/client';
import { getEventById } from '@/services/event';
import { getSession } from '@/services/session';
import { cookies } from 'next/headers';
import Image from 'next/image';

interface PageProps {
  params: { id: string };
}

export interface EventData {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  image: null;
  price: number;
  seats: number;
  startDate: Date;
  endDate: Date;
  duration: string;
  created_at: Date;
  updatet_at: Date;
  userId: number;
  discount: Discount;
  TicketTier: TicketTier[];
}

export interface TicketTier {
  id: number;
  nameTier: string;
  price: number;
  description: string;
  eventId: number;
  ticketId: null;
}

export interface Discount {
  id: number;
  discountStartDate: Date;
  discountEndDate: Date;
  discount: number;
  eventId: number;
}

const getEventData = async (id: string): Promise<EventData> => {
  const res = await getEventById(id);
  return res;
};

export default async function page(props: PageProps) {
  const { params } = props;
  const sessionCookie: string | undefined = cookies().get('user-token')?.value;
  const data = await getEventData(params.id);

  console.log(data);

  return (
    <section className="flex flex-col w-full min-h-screen">
      <div className="w-full rounded-lg overflow-hidden">
        <AspectRatio ratio={16 / 7}>
          {data.image === null ? (
            <Image
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
              alt={data.title}
              width={800}
              height={200}
              className="w-full object-center object-cover"
            />
          ) : (
            <Image
              src={data.title}
              alt={data.title}
              width={800}
              height={200}
              className="w-full object-center object-cover"
            />
          )}
        </AspectRatio>
      </div>
      <div className="flex relative w-full gap-4 py-8 px-4">
        <div className="flex flex-col w-full">
          <h1 className="text-5xl font-bold">{data.title}</h1>
          <p className="text-muted-foreground">{data.description}</p>
        </div>
        <TicketOrder eventData={data} sessionCookie={sessionCookie} />
      </div>
      <p>{JSON.stringify(data)}</p>
    </section>
  );
}
