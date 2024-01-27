import Events from '@/components/route/Events';
import Heading from '@/utils/Heading';
import React from 'react';

export default function page() {
  return (
    <section className="flex flex-col w-full">
      <Heading
				title="Events"
				description="EventHub is a platform to promote your events with ease"
				keywords="Event, Music, Concert, Seminar"
			/>
      <Events/>
    </section>
  );
}