'use client';
import { getSessionClient } from '@/services/client';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '../ui/label';

interface MainContentProps {
  sessionCookie: string | undefined;
}

export default function ProfileInfo(props: MainContentProps) {
  const { sessionCookie } = props;
  const [sessionData, setSessionData] = useState<any>({});

  useEffect(() => {
    getSessionClient(sessionCookie).then((data) => {
      if (data) setSessionData(data);
    });
  }, [sessionCookie]);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center flex items-center justify-center mb-5">
        Profile Information
      </h1>
      <Card>
        {/* <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>Avatar</CardDescription>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </CardHeader> */}
        <CardContent className="grid gap-6 mt-5">
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
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="performance" className="flex flex-col space-y-1">
              <span>Referral Code</span>
              <span className="font-normal leading-snug text-muted-foreground">
                {sessionData?.referral}
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
