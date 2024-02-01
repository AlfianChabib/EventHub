import { cookies } from 'next/headers';

export const sessionCookie: string | undefined =
  cookies().get('user-token')?.value;
