import Hero from "@/components/route/Hero";


export default async function Home() {
  return (
    <section className="flex flex-col w-full min-h-screen">
      <Hero />
    </section>
  );
}
