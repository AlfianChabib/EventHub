import SignUpForm from '@/components/form/SignUpForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Heading from '@/utils/Heading';
import Image from 'next/image';
import Link from 'next/link';

export default function page() {
  return (
    <section className="flex min-h-screen w-full items-center justify-center">
      <Heading
        title="Sign Up"
        description="EventHub is a platform to promote your events with ease"
        keywords="Event, Music, Concert, Seminar"
      />
      <div className="flex">
        <Card className="min-w-[380px]">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Enter your personal information and start journey with us
            </CardDescription>
          </CardHeader>
          <Separator className="mb-2" />
          <CardContent>
            <SignUpForm />
          </CardContent>
          <Separator className="mb-6" />
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Have an account?{' '}
              <Link
                href="/auth/signin"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign-in
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
