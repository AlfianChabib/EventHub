import Test from '@/components/Test';
import { getSession } from '@/services/session';
import { cookies } from 'next/headers';

export default async function Home() {
  // const userToken = cookies().get('user-token');
  // if (!userToken) {
  //   return null;
  // }
  // const sessionData = await getSession();

  // console.log(sessionData);

  return (
    <section className="flex flex-col w-full min-h-screen">
      {/* <Test data={sessionData} /> */}
      <h1>Hello EventHub</h1>
    </section>
  );
}
