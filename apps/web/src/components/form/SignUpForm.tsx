'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Please enter your name.' }),
  username: z.string().min(3, { message: 'Please enter your username.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  referralCode: z.string().optional(),
});

export default function SignUpForm() {
  const router = useRouter();
  const [nameValue, setNamedValue] = useState<string>('');
  const [usernameValue, setUsernameValue] = useState<string>('');
  const [emailValue, setEmailValue] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [referralCodeValue, setReferralCodeValue] = useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: nameValue,
      username: usernameValue,
      email: emailValue,
      password: passwordValue,
      referralCode: referralCodeValue,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios
        .post('http://localhost:8000/api/auth/signup', JSON.stringify(values), {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => res.data)
        .catch((err) => console.log(err));

      console.log(response);
      if (response.success === true) {
        router.push('/auth/signin');
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="referralCode"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Referral Code</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Referal Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
