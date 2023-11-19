'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/_components/ui/avatar';
import { Button } from '@/app/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/app/_components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select';
import { Textarea } from '@/app/_components/ui/textarea';
import { mapel } from '@/constants/mapel';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendIcon } from 'lucide-react';
import Link from 'next/link';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const questionSchema = z.object({
  question: z
    .string({ required_error: 'Pertanyaan tidak boleh kosong' })
    .min(1, 'Pertanyaan tidak boleh kosong')
    .max(500, 'Pertanyaan tidak boleh lebih dari 500 karakter'),
  subject: z
    .string({ required_error: 'Pilih salah satu mapel' })
    .min(1, 'Mapel tidak boleh kosong')
    .max(25),
});

export function QuestionModal({
  avatar,
  children,
  defaultSubject,
  defaultValue,
  fullName,
  title = 'Ajukan pertanyaan',
  username,
}: {
  avatar: {
    fallback: string;
    imageUrl: string;
  };
  children: ReactNode;
  defaultSubject?: string;
  defaultValue?: string;
  fullName: string;
  title?: string;
  username: string;
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof questionSchema>>({
    defaultValues: {
      question: defaultValue,
      subject: defaultSubject,
    },
    resolver: zodResolver(questionSchema),
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof questionSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='md:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <div className='-mx-4 p-4'>
            <div className='flex items-center space-x-3'>
              <Avatar>
                <AvatarImage src={avatar.imageUrl} />
                <AvatarFallback>{avatar.fallback}</AvatarFallback>
              </Avatar>
              <div className='text-left text-[#696984]'>
                <Link
                  className='block max-w-full cursor-pointer truncate font-medium decoration-2 hover:underline'
                  href={`/users/${username}`}
                  title={fullName}
                >
                  {fullName}
                </Link>
                <Link
                  className='block max-w-full truncate font-normal'
                  href={`/users/${username}`}
                  title={`@${username}`}
                >
                  @{username}
                </Link>
              </div>
            </div>

            <div className='py-2'>
              <Form {...form}>
                <form
                  className='space-y-4'
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name='question'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder='Ketik pertanyaan mu di sini'
                            rows={5}
                            {...field}
                            className='mt-2'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='flex justify-between'>
                    <FormField
                      control={form.control}
                      name='subject'
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className='w-[220px]'>
                                <SelectValue placeholder='Mata pelajaran' />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {mapel.map((each) => (
                                <SelectItem key={each.id} value={each.id}>
                                  {each.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      className='rounded-full font-semibold'
                      type='submit'
                    >
                      <SendIcon className='mr-1' size={16} />
                      Kirim
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
