'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { format, formatISO } from 'date-fns';
import { cn } from '@/lib/utils';
import React from 'react';

const formSchema = z.object({
  discount: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: 'Expected number, received a string',
  }),
  discountEndDate: z.date(),
});

interface DiscountEventFormProps {
  setDiscountEventData: React.Dispatch<React.SetStateAction<any>>;
}

export function DiscountEventForm(props: DiscountEventFormProps) {
  const { setDiscountEventData } = props;

  const formDiscount = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      discount: '',
      discountEndDate: new Date(),
    },
  });

  async function onSubmitDiscount(values: z.infer<typeof formSchema>) {
    setDiscountEventData(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Discount</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Discunt</DialogTitle>
        </DialogHeader>
        <Form {...formDiscount}>
          <form
            onSubmit={formDiscount.handleSubmit(onSubmitDiscount)}
            className="space-y-8"
          >
            <FormField
              control={formDiscount.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Discount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formDiscount.control}
              name="discountEndDate"
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
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
