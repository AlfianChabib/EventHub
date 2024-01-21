'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
  Form,
  FormControl,
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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import axios from 'axios';
import Link from 'next/link';
import { eventCategories } from '@/constants/category';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Please enter event title, at least 3 characters' }),
  description: z
    .string()
    .min(6, { message: 'Description must be at least 6 characters.' }),
  category: z.string({
    required_error: 'Event category is required.',
  }),
  location: z.string({
    required_error: 'Location is required.',
  }),
  price: z.number(),
  seats: z
    .number({ required_error: 'Number of seats is required.' })
    .min(1, { message: 'Number of seats must be at least 1.' }),
  date: z.date({ required_error: 'A date of birth is required.' }),
  time: z.string(),
});

export default function CreateEventForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      location: '',
      date: new Date(),
      time: '',
      price: 0,
      seats: 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { date } = values;
      const dateString = format(date, 'yyyy-MM-dd');
      console.log({ ...values, dateString });
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
            name="price"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="md:w-1/2 w-full">
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
                <FormLabel>Venue Location</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="seats"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Avalilable Seats</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Seats" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator className="my-4" />
          <div className="mb-2">
            <h2 className="text-3xl font-semibold">Date and Time</h2>
            <p className="max-w-2xl text-xs text-slate-600">
              Tell event-goers when your event starts and ends so they can make
              plans to attend.
            </p>
          </div>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date Event</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'P')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <Button type="submit">Save & Create</Button> */}
          <div className="flex gap-x-2 justify-end">
            <Button variant="destructive">Discard</Button>
            <Button type="submit">Save & Create</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
