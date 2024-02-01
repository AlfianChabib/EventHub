import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SignInForm from '@/components/form/SignInForm';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import Heading from '@/utils/Heading';

export default function page() {
  return (
    <section className="flex min-h-screen items-center justify-center">
      <Heading
        title="Sign In"
        description="EventHub is a platform to promote your events with ease"
        keywords="Event, Music, Concert, Seminar"
      />
      <div className="flex">
        <div>
          <Card className="min-w-[380px]">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Welcome back, sign in to your account
              </CardDescription>
            </CardHeader>
            <Separator className="mb-2" />
            <CardContent>
              <SignInForm />
            </CardContent>
            <Separator className="mb-6" />
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign-up
                </Link>
              </p>
              <Link
                href={'/'}
                className="text-sm text-muted-foreground underline"
              >
                Home
              </Link>
            </CardFooter>
          </Card>
        </div>
        <div className="flex-1 lg:flex hidden">
          <Image
            src="/assets/concert1.jpg"
            alt="logo"
            width={625}
            height={625}
            priority
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
