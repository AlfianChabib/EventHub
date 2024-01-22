import Hero from "@/components/route/Hero";
import Heading from "@/utils/Heading";
import Image from "next/image";


export default async function Home() {
  return (
    <section className="flex flex-col w-full min-h-screen">
      <Heading
				title="EventHub"
				description="EventHub is a platform to promote your events with ease"
				keywords="Event, Music, Concert, Seminar"
			/>
      <Hero />
    </section>
  );
}
