'use client';
import React, { useEffect, useState } from 'react';
import { TabsContent } from '../ui/tabs';
import MyEvents from './MyEvents';
import ProfileInfo from './ProfileInfo';
import Dashboard from './Dashboard';
import Orders from './Orders';
import MyPoints from './MyPoints';
import MyTickets from './MyTickets';
import { ProfileUser, getProfileUser } from '@/services/client';

interface MainContentProps {
  sessionCookie: string | undefined;
}

export default function MainContent(props: MainContentProps) {
  const { sessionCookie } = props;
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);

  useEffect(() => {
    if (sessionCookie) {
      getProfileUser(sessionCookie).then((data) => {
        if (data) setProfileUser(data);
      });
    }
  }, [sessionCookie]);

  if (!sessionCookie) {
    return null;
  }

  return (
    <div className="flex w-full md:p-4 p-2 border rounded-md">
      <TabsContent value="profile" className="w-full with-navbar">
        <ProfileInfo sessionCookie={sessionCookie} />
      </TabsContent>
      <TabsContent value="tickets" className="w-full with-navbar">
        <MyTickets sessionCookie={sessionCookie} profileUser={profileUser} />
      </TabsContent>
      <TabsContent value="points" className="w-full with-navbar">
        <MyPoints sessionCookie={sessionCookie} profileUser={profileUser} />
      </TabsContent>
      {profileUser?.role === 'event-organizer' &&
      profileUser?.event.length > 0 ? (
        <>
          <TabsContent value="dashboard" className="w-full with-navbar">
            <Dashboard
              profileUser={profileUser}
              sessionCookie={sessionCookie}
            />
          </TabsContent>
          <TabsContent value="events" className="w-full with-navbar">
            <MyEvents sessionCookie={sessionCookie} profileUser={profileUser} />
          </TabsContent>
          {/* <TabsContent value="orders" className="w-full with-navbar">
            <Orders sessionCookie={sessionCookie} />
          </TabsContent> */}
        </>
      ) : null}
    </div>
  );
}
