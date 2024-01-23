'use client';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Bookmark,
  Package,
  PackagePlus,
  ShoppingCart,
  User,
  PanelRightOpen,
  PanelLeftOpen,
} from 'lucide-react';
import {
  EventDataResponse,
  getEventByUserSession,
  getSessionClient,
} from '@/services/client';

interface SidebarProps {
  sessionCookie: string | undefined;
}

export default function Sidebar(props: SidebarProps) {
  const { sessionCookie } = props;
  const [isOpen, setIsOpen] = useState(false);
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

  console.log(sessionData);
  console.log(eventData);

  const handleOpenSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`lg:flex lg:relative absolute bg-background lg:-translate-x-0 ease-in transition-all flex-col lg:w-[500px] max-w-[500px] min-h-full p-4 gap-4 border rounded-md justify-between ${
        isOpen ? '-translate-x-0' : '-translate-x-[330px]'
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
                {/* <AvatarImage src="https://avatars.githubusercontent.com/u/108635592?v=4" /> */}
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center gap-1">
                <CardTitle>Alfian Chabib</CardTitle>
                <CardDescription>
                  <span>@</span>alfianchabib
                </CardDescription>
              </div>
            </div>
            <Separator />
            <div className="flex gap-4 p-2 items-center justify-center">
              <CardDescription>
                Event : <span>{eventData.length}</span>
              </CardDescription>
              <Separator orientation="vertical" className="h-6" />
              <CardDescription>
                Voucher : <span>0</span>
              </CardDescription>
              <Separator orientation="vertical" className="h-6" />
              <CardDescription>
                Point : <span>0</span>
              </CardDescription>
            </div>
          </Card>
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
                  value="products"
                  onClick={handleOpenSidebar}
                >
                  <p>Event</p>
                  <Package size={18} />
                </TabsTrigger>
                <Separator />
                <TabsTrigger
                  className="w-full justify-between"
                  value="carts"
                  onClick={handleOpenSidebar}
                >
                  <p>Ticket</p>
                  <ShoppingCart size={18} />
                </TabsTrigger>
                <Separator />
                <TabsTrigger
                  className="w-full justify-between"
                  value="wishlists"
                  onClick={handleOpenSidebar}
                >
                  <p>Wishlists</p>
                  <Bookmark size={18} />
                </TabsTrigger>
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
            <PackagePlus />
            <p className="text-xl">Create Product</p>
          </TabsTrigger>
        </TabsList>
      </div>
    </div>
  );
}
