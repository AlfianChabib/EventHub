'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from '/public/logo.png';
import Image from 'next/image';
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import { getSessionClient } from '@/services/client';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Megaphone, PlusSquare, User } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  sessionCookie?: string;
}

export default function Header(props: HeaderProps) {
  const { sessionCookie } = props;
  const router = useRouter();
  const pathname = usePathname();
  const hiddenHeader = ['/auth/signin', '/auth/signup'];
  const hideCreateButton = ['/create-event', '/event/[id]', '/event/[id]/edit'];

  const [sessionData, setSessionData] = useState<any>({});

  useEffect(() => {
    getSessionClient(sessionCookie).then((data) => {
      if (data) setSessionData(data);
    });
  }, [sessionCookie]);

  const handleLogout = async () => {
    await axios.post('http://localhost:8000/api/auth/signout', {
      withCredentials: true,
    });
    router.push('/');
    router.refresh();
  };

  if (hiddenHeader.includes(pathname)) return null;
  return (
    <header className="flex sticky top-2 left-0 z-50 bg-slate-900 items-center justify-between w-full p-2 rounded-lg my-2 gap-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Image
                  src={Logo}
                  alt="logo"
                  width={24}
                  height={24}
                  className="md:mr-2 mr-0"
                />
                <p className="text-xl font-bold sm:flex hidden">EventHub</p>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {!sessionCookie ? (
        <NavigationMenu className="flex justify-between">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button asChild variant="secondary">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button asChild variant="secondary">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      ) : (
        <NavigationMenu className="flex justify-between">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button asChild variant="secondary">
                <Link href="/events" className="flex gap-1 items-center">
                  <Megaphone />
                  <p>Events</p>
                </Link>
              </Button>
            </NavigationMenuItem>
            {hideCreateButton.includes(pathname) ? null : (
              <NavigationMenuItem>
                <Button asChild variant="secondary" className="sm:flex hidden">
                  <Link
                    href="/create-event"
                    className="flex gap-1 items-center"
                  >
                    <PlusSquare />
                    <p>Create Event</p>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="sm:hidden flex"
                  size="icon"
                >
                  <Link href="/create-event">
                    <PlusSquare />
                  </Link>
                </Button>
              </NavigationMenuItem>
            )}

            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon">
                    <User />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 md:mr-0 mr-2"
                  sideOffset={6}
                >
                  <DropdownMenuLabel>
                    <p>{sessionData?.username}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link className="w-full" href="/profile">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <Separator className="my-2" />
                    <DropdownMenuItem>
                      <Link className="w-full" href="/events">
                        Events
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link className="w-full" href="/faq">
                        FAQ
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link className="w-full" href="/about">
                        About Us
                      </Link>
                    </DropdownMenuItem>
                    <Separator className="my-2" />
                    <DropdownMenuItem onClick={handleLogout}>
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </header>
  );
}
