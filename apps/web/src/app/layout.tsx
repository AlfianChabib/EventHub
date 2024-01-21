import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cookies } from 'next/headers';
import './globals.css';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionCookie: string | undefined = cookies().get('user-token')?.value;
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <main className="flex flex-col max-w-7xl mx-auto px-2 relative">
          <Header sessionCookie={sessionCookie} />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
