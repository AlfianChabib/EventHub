'use client';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ShoppingCart,
  User,
  PanelRightOpen,
  PanelLeftOpen,
  PlusSquare,
  Coins,
  Ticket,
  LayoutDashboard,
  CalendarRange,
} from 'lucide-react';
import { SessionData, getSessionClient } from '@/services/client';

interface SidebarProps {
  sessionCookie: string | undefined;
}

export default function Sidebar(props: SidebarProps) {
  const { sessionCookie } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  useEffect(() => {
    getSessionClient(sessionCookie).then((data) => {
      if (data) setSessionData(data);
    });
  }, [sessionCookie]);

  if (!sessionData) {
    return;
  }

  console.log(sessionData);

  const displayName =
    sessionData.name.length > 15
      ? `${sessionData.name.slice(0, 15)}...`
      : sessionData.name;

  const handleOpenSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`lg:flex lg:relative absolute bg-background lg:-translate-x-0 ease-in transition-all flex-col lg:w-[500px] max-w-[500px] min-h-full p-4 gap-4 border rounded-md justify-between z-20 ${
        isOpen ? '-translate-x-0' : '-translate-x-[380px]'
      } `}
    >
      <Button
        onClick={handleOpenSidebar}
        variant="default"
        className={`lg:hidden w-12 px-0 z-10 absolute transition-all top-10 -right-4 ${
          isOpen ? '' : '-right-12'
        }`}
      >
        {isOpen ? <PanelRightOpen /> : <PanelLeftOpen />}
      </Button>
      <div className="flex flex-col with-navbar justify-between">
        <div className="flex flex-col gap-4 w-full">
          <Card className="overflow-hidden">
            <div className="flex gap-4 p-2">
              <Avatar className="w-16 h-16 items-center justify-center border">
                <AvatarImage src={sessionData?.image} />
                <AvatarFallback>{sessionData?.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center gap-1">
                <CardTitle>{displayName}</CardTitle>
                <CardDescription>{sessionData?.email}</CardDescription>
              </div>
            </div>
            <Separator />
            <div className="flex gap-4 p-2 items-center justify-center">
              <CardDescription className="font-semibold">
                {/* Point : <span>{sessionData?.point}</span> */}
                Point : <span>0</span>
              </CardDescription>
            </div>
          </Card>
          <h1 className="flex items-center justify-center font-semibold">
            User Information
          </h1>
          <div className="flex items-center justify-center border rounded-md">
            <div defaultValue="profile" className="w-full p-1">
              <TabsList className="flex-col w-full h-full gap-2">
                <TabsTrigger
                  className="w-full justify-between"
                  value="profile"
                  onClick={handleOpenSidebar}
                >
                  <p>Profile</p>
                  <User size={18} />
                </TabsTrigger>
                <Separator />
                <TabsTrigger
                  className="w-full justify-between"
                  value="tickets"
                  onClick={handleOpenSidebar}
                >
                  <p>My Tickets</p>
                  <Ticket size={18} />
                </TabsTrigger>
                <Separator />
                <TabsTrigger
                  className="w-full justify-between"
                  value="points"
                  onClick={handleOpenSidebar}
                >
                  <p>My Points</p>
                  <Coins size={18} />
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          <h1 className="flex items-center justify-center font-semibold">
            Event Organizer
          </h1>
          <div className="flex items-center justify-center border rounded-md">
            <div defaultValue="profile" className="w-full p-1">
              <TabsList className="flex-col w-full h-full gap-2">
                <TabsTrigger
                  className="w-full justify-between"
                  value="dashboard"
                  onClick={handleOpenSidebar}
                >
                  <p>Dashboard</p>
                  <LayoutDashboard size={18} />
                </TabsTrigger>
                <Separator />
                <TabsTrigger
                  className="w-full justify-between"
                  value="events"
                  onClick={handleOpenSidebar}
                >
                  <p>My Events</p>
                  <CalendarRange size={18} />
                </TabsTrigger>
                <Separator />
                <TabsTrigger
                  className="w-full justify-between"
                  value="orders"
                  onClick={handleOpenSidebar}
                >
                  <p>Orders</p>
                  <ShoppingCart size={18} />
                </TabsTrigger>
                <Separator />
              </TabsList>
            </div>
          </div>
        </div>

        <TabsList className="flex flex-col w-full h-20 border">
          <TabsTrigger
            value="createProduct"
            className="flex w-full h-full gap-2"
            onClick={handleOpenSidebar}
          >
            <PlusSquare />
            <p className="text-xl">Create Event</p>
          </TabsTrigger>
        </TabsList>
      </div>
    </div>
  );
}
