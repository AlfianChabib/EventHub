'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderData } from './TicketOrder';
import { ProfileUser } from '@/services/client';

const FormSchema = z.object({
  voucherId: z.string(),
});

interface VoucherProps {
  setOrderData: React.Dispatch<React.SetStateAction<OrderData>>;
  profileUser: ProfileUser | null;
}

export function Voucher(props: VoucherProps) {
  const { setOrderData, profileUser } = props;

  const voucherForm = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    setOrderData((prev) => ({ ...prev, voucherId: parseInt(data.voucherId) }));
  }

  return (
    <Form {...voucherForm}>
      <form
        onSubmit={voucherForm.handleSubmit(onSubmit)}
        className="flex gap-2 items-center justify-center"
      >
        <FormField
          control={voucherForm.control}
          name="voucherId"
          render={({ field }) => (
            <FormItem className="flex w-full gap-2 items-center justify-center">
              <FormLabel>Voucher</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {profileUser?.voucher.map((voucher, index) => (
                    <SelectItem key={index} value={voucher.id.toString()}>
                      Voucher {voucher.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
