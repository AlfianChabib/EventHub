import { SidebarMenu } from '@/components/SideBar';
import Heading from '@/utils/Heading';

export default function page() {
  return (
    <section className="flex flex-col w-full min-h-screen">
      <div className="flex flex-1 w-full">
        {/* <Heading
          title={`${user?.name} Profile | Elearning`}
          description="E learning platform for student to learn and get help from teachers"
          keywords="Programming,Redux,ML,"
        /> */}
        <SidebarMenu />
        {/* <Profile user={user} /> */}
      </div>
    </section>
  );
}
