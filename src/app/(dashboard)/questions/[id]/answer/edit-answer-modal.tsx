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

export function EditAnswerModal({
  children,
  user,
  question,
  defaultValue,
}: {
  children: ReactNode;
  user: {
    avatar: {
      imageUrl: string;
      fallback: string;
    };
    fullName: string;
    username: string;
  };
  question: {
    id: string;
    date: Date;
    content: string;
    subject: {
      id: string;
      name: string;
    };
    user?: {
      avatar: {
        imageUrl: string;
        fallback: string;
      };
      fullName: string;
      username: string;
    };
  };
  defaultValue?: string;
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      answer: defaultValue,
    },
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
          <DialogTitle>Edit jawaban</DialogTitle>
          <div className='-mx-4 flex space-x-3 border-b-2 p-4'>
            <Avatar>
              <AvatarImage src={question.user?.avatar.imageUrl} />
              <AvatarFallback>{question.user?.avatar.fallback}</AvatarFallback>
            </Avatar>
            <div className='grow space-y-1'>
              <div className='flex items-center space-x-2 text-[#696984]'>
                <Link
                  href={`/users/${question.user?.username}`}
                  className='max-w-[6.25rem] cursor-pointer truncate font-medium decoration-2 hover:underline md:max-w-[12rem]'
                  title={question.user?.fullName}
                >
                  {question.user?.fullName}
                </Link>
                <Link
                  href={`/users/${question.user?.username}`}
                  className='max-w-[6.25rem] truncate font-normal md:max-w-[12rem]'
                  title={`@${question.user?.username}`}
                >
                  @{question.user?.username}
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
                    variant='secondary'
                    className='mt-3 hover:bg-slate-200'
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
                  href={`/users/${user.username}`}
                  className='block max-w-full cursor-pointer truncate font-medium decoration-2 hover:underline'
                  title={user.fullName}
                >
                  {user.fullName}
                </Link>
                <Link
                  href={`/users/${user.username}`}
                  className='block max-w-full truncate font-normal'
                  title={`@${user.username}`}
                >
                  @{user.username}
                </Link>
              </div>
            </div>

            <div className='py-2'>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-4'
                >
                  <FormField
                    control={form.control}
                    name='answer'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder='Ketik jawaban mu di sini'
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
                      type='submit'
                      className='rounded-full font-semibold'
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
