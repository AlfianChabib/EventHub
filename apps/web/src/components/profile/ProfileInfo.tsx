'use client';
import { getEventByUserSession, getSessionClient } from '@/services/client';
import React, { useEffect, useState } from 'react';
import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Label } from "../ui/label"

interface MainContentProps {
  sessionCookie: string | undefined;
}

export default function EventProfile(props: MainContentProps) {
  const { sessionCookie } = props;
  const [sessionData, setSessionData] = useState<any>({});
  const [eventData, setEventData] = useState<any>([]);

  useEffect(() => {
    getEventByUserSession(sessionCookie).then((data) => {
      if (data) setEventData(data);
    });
  }, [sessionCookie]);

  useEffect(() => {
    getSessionClient(sessionCookie).then((data) => {
      if (data) setSessionData(data);
    });
  }, [sessionCookie]);

  console.log(eventData);
  return (
    <div>
      <h1 className="text-3xl font-semibold text-center flex items-center justify-center mb-5">Profile Information</h1>
      <Card>
      <CardHeader>
        <CardTitle>Avatar</CardTitle>
        <CardDescription>Avatar</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="necessary" className="flex flex-col space-y-1">
            <span>Name</span>
            <span className="font-normal leading-snug text-muted-foreground">
            {sessionData?.name}
            </span>
          </Label>
          {/* <Switch id="necessary" defaultChecked /> */}
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="functional" className="flex flex-col space-y-1">
            <span>Email</span>
            <span className="font-normal leading-snug text-muted-foreground">
            {sessionData?.email}
            </span>
          </Label>
          {/* <Switch id="functional" /> */}
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="performance" className="flex flex-col space-y-1">
            <span>Username</span>
            <span className="font-normal leading-snug text-muted-foreground">
            {sessionData?.username}
            </span>
          </Label>
          {/* <Switch id="performance" /> */}
        </div>
      </CardContent>
      <CardFooter>
        {/* <Button variant="outline" className="w-full">
          Save preferences
        </Button> */}
      </CardFooter>
    </Card>
    </div>
  );
}
