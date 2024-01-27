'use client';
import React from 'react';
import { TabsContent } from '../ui/tabs';
import MyEvents from './MyEvents';
import ProfileInfo from './ProfileInfo';
import Dashboard from './Dashboard';
import Orders from './Orders';
import MyPoints from './MyPoints';
import MyTickets from './MyTickets';

interface MainContentProps {
  sessionCookie: string | undefined;
}

export default function MainContent(props: MainContentProps) {
  const { sessionCookie } = props;
  return (
    <div className="flex w-full p-4 border rounded-md">
      <TabsContent value="profile" className="w-full with-navbar">
        <ProfileInfo sessionCookie={sessionCookie} />
      </TabsContent>
      <TabsContent value="tickets" className="w-full with-navbar">
        {/* <h1 className="text-3xl font-semibold text-center flex items-center justify-center mb-5">
          Profile Information
        </h1> */}
        <MyTickets/>
      </TabsContent>
      <TabsContent value="points" className="w-full with-navbar">
        <MyPoints sessionCookie={sessionCookie} />
      </TabsContent>
      <TabsContent value="dashboard" className="w-full with-navbar">
        <Dashboard sessionCookie={sessionCookie} />
      </TabsContent>
      <TabsContent value="events" className="w-full with-navbar">
        <MyEvents sessionCookie={sessionCookie} />
      </TabsContent>
      <TabsContent value="orders" className="w-full with-navbar">
        <Orders sessionCookie={sessionCookie} />
      </TabsContent>
    </div>
  );
}
