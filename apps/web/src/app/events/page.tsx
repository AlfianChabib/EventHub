import Events from '@/components/route/Events';
import { getAllEvents } from '@/services/event';
import Heading from '@/utils/Heading';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

async function getEventData() {
  const result = await getAllEvents(1, 10);

  return result;
}

export default async function page() {
  const eventResponse = await getEventData();

  return (
    <section className="flex flex-col w-full">
      <Heading
        title="Events"
        description="EventHub is a platform to promote your events with ease"
        keywords="Event, Music, Concert, Seminar"
      />
      <Events eventData={eventResponse.data.events} />
    </section>
  );
}
