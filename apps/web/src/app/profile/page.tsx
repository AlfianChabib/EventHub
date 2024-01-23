import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import Sidebar from '@/components/profile/Sidebar';
import MainContent from '@/components/profile/MainContent';
import { sessionCookie } from '@/lib/sessionCookie';

export default function page() {
  return (
    <section className="flex flex-col w-full">
      <Tabs
        defaultValue="profile"
        className="flex relative w-full with-navbar max-w-7xl gap-4"
      >
        {/* left */}
        <Sidebar sessionCookie={sessionCookie} />
        {/* right */}
        <MainContent sessionCookie={sessionCookie} />
      </Tabs>
    </section>
  );
}
