'use client';
import React from 'react';
import { TabsContent } from '../ui/tabs';
import EventProfile from './MyEvents';
import ProfileInfo from './ProfileInfo';
import Dashboard from './Dashboard';

interface MainContentProps {
  sessionCookie: string | undefined;
}

export default function MainContent(props: MainContentProps) {
  const { sessionCookie } = props;
  return (
    <div className="flex w-full p-4 border rounded-md">
      <TabsContent value="profile" className="w-full with-navbar" >
        <ProfileInfo sessionCookie={sessionCookie} />
      </TabsContent>
      <TabsContent value="tickets" className="w-full with-navbar">
        <h1 className="text-3xl">My Tickets</h1>
      </TabsContent>
      <TabsContent value="points" className="w-full with-navbar">
        <h1 className="text-3xl">My Points</h1>
      </TabsContent>
      <TabsContent value="dashboard" className="w-full with-navbar">
        <Dashboard sessionCookie={sessionCookie} />
      </TabsContent>
      <TabsContent value="events" className="w-full with-navbar">
        <EventProfile sessionCookie={sessionCookie} />
      </TabsContent>
      <TabsContent value="orders" className="w-full with-navbar">
        <h1 className="text-3xl">Orders</h1>
      </TabsContent>
    </div>
  );
}
