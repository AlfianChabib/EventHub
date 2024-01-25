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
      <div className='flex align-items'>
        <div>
          <Card className="min-w-[400px]">
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
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign-up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
        <div className="flex flex-1">
          <Image
            src="/assets/concert1.jpg"
            alt="logo"
            width={625}
            height={625}
          />
        </div>
      </div>
    </section>
  );
}
