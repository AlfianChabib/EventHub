'use client';
import React from 'react';
import { TabsContent } from '../ui/tabs';
import EventProfile from './EventProfile';

interface MainContentProps {
  sessionCookie: string | undefined;
}

export default function MainContent(props: MainContentProps) {
  const { sessionCookie } = props;
  return (
    <div className="flex w-full p-4 border rounded-md">
      <TabsContent value="profile" className="w-full with-navbar">
        <h1 className="text-3xl">Profile</h1>
      </TabsContent>
      <TabsContent value="products" className="w-full with-navbar">
        <EventProfile sessionCookie={sessionCookie} />
      </TabsContent>
      <TabsContent value="carts" className="w-full with-navbar">
        <h1 className="text-3xl">Carts</h1>
      </TabsContent>
      <TabsContent value="wishlists" className="w-full with-navbar">
        <h1 className="text-3xl">Wishlists</h1>
      </TabsContent>
      <TabsContent value="createProduct" className="w-full with-navbar">
        <h1 className="text-3xl">Create Product</h1>
      </TabsContent>
    </div>
  );
}
