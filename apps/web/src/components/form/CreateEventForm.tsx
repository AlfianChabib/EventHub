'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
import Link from 'next/link';
import { eventCategories } from '@/constants/category';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Please enter event title, at least 3 characters' }),
  description: z
    .string()
    .min(6, { message: 'Description must be at least 6 characters.' }),
  category: z.string(),
  location: z.string(),
  price: z.string().optional(),
  seats: z.number(),
  date: z.date(),
  time: z.string(),
});

export default function CreateEventForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
    } catch (error) {}
  };
  return (
    <div className="md:p-8 p-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-2"
        >
          <div>
            <h2 className="text-3xl font-semibold">Basic Information</h2>
            <p className="max-w-2xl text-xs text-slate-600">
              Name your event and tell event-goers why they should come. Add
              details that highlight what makes it unique.
            </p>
          </div>
          <FormField
            control={form.control}
            name="title"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Event Description</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a event category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {eventCategories.map((category, index) => (
                      <SelectItem key={index} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator className="my-4" />
          <div>
            <h2 className="text-3xl font-semibold">Location</h2>
            <p className="max-w-2xl text-xs text-slate-600">
              Help people in the area discover your event and let attendees know
              where to show up.
            </p>
          </div>
          <FormField
            control={form.control}
            name="location"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Event Location</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-x-2 justify-end">
            <Button variant="destructive">Discard</Button>
            <Button type="submit">Save & Create</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
