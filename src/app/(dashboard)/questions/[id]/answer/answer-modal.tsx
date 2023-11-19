'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/_components/ui/avatar';
import { Badge } from '@/app/_components/ui/badge';
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
import { Textarea } from '@/app/_components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import relativeTime from 'dayjs/plugin/relativeTime';
import { SendIcon } from 'lucide-react';
import Link from 'next/link';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

dayjs.extend(relativeTime);

const answerSchema = z.object({
  answer: z
    .string({ required_error: 'Jawaban tidak boleh kosong' })
    .min(1, 'Jawaban tidak boleh kosong')
    .max(500, 'Jawaban tidak boleh lebih dari 500 karakter'),
});

export function AnswerModal({
  children,
  question,
  user,
}: {
  children: ReactNode;
  question: {
    content: string;
    date: Date;
    id: string;
    subject: {
      id: string;
      name: string;
    };
  };
  user: {
    avatar: {
      fallback: string;
      imageUrl: string;
    };
    fullName: string;
    username: string;
  };
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof answerSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='md:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Tambah jawaban</DialogTitle>
          <div className='-mx-4 flex space-x-3 border-b-2 p-4'>
            <Avatar>
              <AvatarImage src={user.avatar.imageUrl} />
              <AvatarFallback>{user.avatar.fallback}</AvatarFallback>
            </Avatar>
            <div className='grow space-y-1'>
              <div className='flex items-center space-x-2 text-[#696984]'>
                <Link
                  className='max-w-[6.25rem] cursor-pointer truncate font-medium decoration-2 hover:underline md:max-w-[12rem]'
                  href={`/users/${user.username}`}
                  title={user.fullName}
                >
                  {user.fullName}
                </Link>
                <Link
                  className='max-w-[6.25rem] truncate font-normal md:max-w-[12rem]'
                  href={`/users/${user.username}`}
                  title={`@${user.username}`}
                >
                  @{user.username}
                </Link>
                <div
                  className='font-light'
                  title={dayjs(question.date).format(
                    'dddd, D MMMM YYYY HH:mm:ss',
                  )}
                >
                  <span className='mr-2 text-sm font-medium'>·</span>
                  <span className='hover:underline md:hidden'>
                    {dayjs(question.date).locale('id').fromNow(true)}
                  </span>
                  <span className='hidden hover:underline md:inline'>
                    {dayjs(question.date).locale('id').fromNow()}
                  </span>
                </div>
              </div>
              <p className='py-1 text-left text-sm leading-relaxed text-[#696984]'>
                {question.content}
              </p>
              <div className='flex justify-start'>
                <Link href={`/subjects/${question.subject.id}`}>
                  <Badge
                    className='mt-3 hover:bg-slate-200'
                    variant='secondary'
                  >
                    {question.subject.name}
                  </Badge>
                </Link>
              </div>
            </div>
          </div>
          <div className='pt-2'>
            <div className='flex items-center space-x-3'>
              <Avatar>
                <AvatarImage src={user.avatar.imageUrl} />
                <AvatarFallback>{user.avatar.fallback}</AvatarFallback>
              </Avatar>
              <div className='text-left text-[#696984]'>
                <Link
                  className='block max-w-full cursor-pointer truncate font-medium decoration-2 hover:underline'
                  href={`/users/${user.username}`}
                  title={user.fullName}
                >
                  {user.fullName}
                </Link>
                <Link
                  className='block max-w-full truncate font-normal'
                  href={`/users/${user.username}`}
                  title={`@${user.username}`}
                >
                  @{user.username}
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
                    name='answer'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder='Ketik jawaban mu di sini'
                            rows={5}
                            {...field}
                            className='mt-2'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='flex justify-end'>
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
