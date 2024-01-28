import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useForm, UseFormProps, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const validationSchema = z.object({
  ticketTiers: z.array(
    z.object({
      nameTier: z.string(),
      price: z.string().refine((val) => !Number.isNaN(parseInt(val, 10))),
      description: z.string(),
    }),
  ),
});

export type Tier = z.infer<typeof validationSchema>['ticketTiers'][number];

const TierInitial: Tier[] = [
  { nameTier: 'vvip', price: '0', description: '' },
  { nameTier: 'vip', price: '0', description: '' },
];

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
    schema: TSchema;
  },
) {
  const form = useForm<TSchema['_input']>({
    ...props,
    resolver: zodResolver(props.schema, undefined, {
      raw: true,
    }),
  });

  return form;
}

interface Props {
  setTicketTierData: React.Dispatch<React.SetStateAction<any[]>>;
}

export function TicketTierForm(props: Props) {
  const { setTicketTierData } = props;

  const {
    handleSubmit,
    register,
    control,
    formState: { isValid, errors, isDirty },
    reset,
  } = useZodForm({
    schema: validationSchema,
    defaultValues: { ticketTiers: TierInitial },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'ticketTiers',
    control,
  });

  const isSubmittable = !!isDirty && !!isValid;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Ticket Tier</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Ticket Tier</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) => {
            let result: any[] = [];

            data.ticketTiers.forEach((tier) => {
              result.push({ ...tier, price: parseInt(tier.price) });
            });
            setTicketTierData(result);
            reset(data);
          })}
          className="w-full"
        >
          {fields.map((field, index) => {
            const errorForField = errors?.ticketTiers?.[index]?.nameTier;
            return (
              <div className="flex gap-2" key={field.id}>
                <div className="p-2 h-full flex justify-end items-start">
                  <p className="text-center">{index + 1}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Input
                      {...register(`ticketTiers.${index}.nameTier` as const)}
                      placeholder="Enter a tier name.."
                      type="text"
                      defaultValue={field.nameTier}
                    />
                    <Input
                      {...register(`ticketTiers.${index}.price` as const)}
                      type="number"
                      placeholder="Enter a price.."
                      defaultValue={field.price}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      {...register(`ticketTiers.${index}.description` as const)}
                      type="text"
                      placeholder="Enter a description.."
                      defaultValue={field.description}
                    />
                    <Button type="button" onClick={() => remove(index)}>
                      Delete
                    </Button>
                  </div>
                  <p>{errorForField?.message ?? <>&nbsp;</>}</p>
                </div>
              </div>
            );
          })}
          <DialogFooter>
            <Button
              onClick={() =>
                append({
                  nameTier: '',
                  price: '0',
                  description: '',
                })
              }
            >
              Add
            </Button>
            <Button disabled={!isSubmittable} type="submit">
              <p>Submit</p>
              {!isSubmittable && <p>(Disabled)</p>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
