import Link from 'next/link';
import { cookies } from 'next/headers';
import { ChevronLeft } from 'lucide-react';
import CreateEventForm from '@/components/form/CreateEventForm';

export default function page() {
  const session: string | undefined = cookies().get('user-token')?.value;
  return (
    <section className="flex flex-col w-full items-center min-h-screen">
      <div className="flex flex-col w-full h-full max-w-4xl border my-2 md:p-4 p-2 md:rounded-xl rounded-md">
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="flex items-center">
            <ChevronLeft size={16} />
            Home
          </Link>
          <h1 className="text-xl font-medium">Create new event</h1>
        </div>
        <CreateEventForm session={session} />
      </div>
    </section>
  );
}