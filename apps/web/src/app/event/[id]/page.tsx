import TicketOrder from '@/components/event/TicketOrder';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { getEventById } from '@/services/event';
import { cookies } from 'next/headers';
import Image from 'next/image';
import HeroImage from '/public/assets/concert1.jpg';

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
          <Image
            src={data.image || HeroImage}
            width={500}
            height={300}
            className="w-full object-cover rounded-lg"
            alt={data.title}
            priority
          />
        </AspectRatio>
      </div>
      <div className="flex relative w-full gap-4 py-8 px-4">
        <div className="flex flex-col w-full">
          <p className="text-muted-foreground">{data.startDate}</p>
          <br />
          <h1 className="text-5xl font-bold">{data.title}</h1>
          <br />
          <p className="text-muted-foreground">{data.location}</p>
          <p className="text-muted-foreground">{data.description}</p>
        </div>
        <TicketOrder eventData={data} sessionCookie={sessionCookie} />
      </div>
    </section>
  );
}
