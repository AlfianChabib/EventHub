'use client';

import * as z from 'zod';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '../ui/separator';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { eventCategories } from '@/constants/category';
import { generateTimeArray } from '@/constants/time';
import { format, formatDistance, formatISO } from 'date-fns';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TicketTierForm, Tier } from './TicketTierForm';
import { DiscountEventForm } from './DiscountEventForm';

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
  price: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: 'Expected number, received a string',
  }),
  seats: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: 'Expected number, received a string',
  }),
  startDate: z.date({ required_error: 'A date of birth is required.' }),
  endDate: z.date({ required_error: 'A date of birth is required.' }),
  startDatetime: z.string(),
  endDatetime: z.string(),
  ticketTiers: z
    .array(
      z.object({
        nameTier: z.string(),
        price: z.string().refine((val) => !Number.isNaN(parseInt(val, 10))),
        description: z.string(),
      }),
    )
    .optional(),
  discountEvent: z
    .object({
      discount: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: 'Expected number, received a string',
      }),
      discountStartDate: z.date().optional(),
      discountEndDate: z.date().optional(),
    })
    .optional(),
});

interface CreateEventFormProps {
  session?: string;
}

export interface TicketTier {
  nameTier: string;
  price: number;
  description: string;
}

interface DiscountData {
  discount: string;
  discountEndDate: Date;
}

export default function CreateEventForm(props: CreateEventFormProps) {
  const router = useRouter();
  const { session } = props;
  const time = generateTimeArray();
  const [ticketTierData, setTicketTierData] = useState<Tier[]>([]);
  const [discountEventData, setDiscountEventData] = useState<DiscountData>({
    discount: '0',
    discountEndDate: new Date(),
  });

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      location: '',
      startDate: new Date(),
      endDate: new Date(),
      startDatetime: '',
      endDatetime: '',
      price: '0',
      seats: '0',
      ticketTiers: [],
      discountEvent: {
        discount: '0',
        discountStartDate: new Date(),
        discountEndDate: new Date(),
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { price, seats, startDate, endDate, startDatetime, endDatetime } =
        values;

      const { discount, discountEndDate } = discountEventData;

      const startDateISO = formatISO(startDate, { representation: 'date' });
      const endDateISO = formatISO(endDate, { representation: 'date' });
      const startDatetimeISO = formatISO(
        new Date(startDateISO + 'T' + startDatetime),
      );
      const endDatetimeISO = formatISO(
        new Date(endDateISO + 'T' + endDatetime),
      );

      const endDateDiscountISO = formatISO(discountEndDate);

      const newDateIso = formatISO(new Date());

      const duration = formatDistance(
        new Date(startDatetimeISO),
        new Date(endDatetimeISO),
      );

      const response = await axios
        .post(
          'http://localhost:8000/api/event',
          {
            title: values.title,
            description: values.description,
            category: values.category,
            location: values.location,
            price: parseInt(price),
            seats: parseInt(seats),
            startDate: startDatetimeISO,
            endDate: endDatetimeISO,
            duration,
            ticketTiers: [...ticketTierData],
            discountEvent: {
              discount: parseInt(discount),
              discountEndDate: endDateDiscountISO,
              discountStartDate: newDateIso,
            },
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session}`,
            },
          },
        )
        .then((res) => res.data)
        .catch((err) => console.log(err));

      console.log(response);

      if (response.success === true) {
        router.push('/profile');
        router.refresh();
        form.reset();
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
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
          <FormField
            control={form.control}
            name="price"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type={'number'} placeholder="Price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between items-end pt-2">
            <div>
              <h2 className="text-xl font-semibold">Discount Promo?</h2>
              <p>Ticket tier is the price at which users get more facilities</p>
            </div>
            <DiscountEventForm setDiscountEventData={setDiscountEventData} />
          </div>
          <div className="flex justify-between items-end pt-2">
            <div>
              <h2 className="text-xl font-semibold">Ticket Tier?</h2>
              <p>Ticket tier is the price at which users get more facilities</p>
            </div>
            <TicketTierForm setTicketTierData={setTicketTierData} />
          </div>
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
          <div className="flex md:flex-row flex-col md:gap-4 gap-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-1 gap-1">
                  <FormLabel className="leading-4">Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'md:w-80 w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'P')
                          ) : (
                            <span>Pick a start date</span>
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
                        disabled={(date) => date <= new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDatetime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="md:w-80 w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a start time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {time.map((time, index) => (
                        <SelectItem key={index} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex md:flex-row flex-col md:gap-4 gap-2">
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-1 gap-1">
                  <FormLabel className="leading-4">End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'md:w-80 w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'P')
                          ) : (
                            <span>Pick a end date</span>
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
                        disabled={(date) => date <= new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDatetime"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>End Time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="md:w-80 w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a end time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {time.map((time, index) => (
                        <SelectItem key={index} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator className="my-4" />
          <div className="flex gap-x-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => router.push('/myprofile')}
            >
              Discard
            </Button>
            <Button type="submit">Submit & Create</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// ticketTiers: z.array(
//   z.object({
//     nameTier1: z.string(),
//     priceTier1: z.string(),
//     descriptionTier1: z.string(),
//   }),
//   z.object({
//     nameTier2: z.string(),
//     priceTier2: z.string(),
//     descriptionTier2: z.string(),
//   }),
// ),
