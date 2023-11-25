'use client';

import 'dayjs/locale/id';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { SendIcon } from 'lucide-react';
import Link from 'next/link';
import { type Session } from 'next-auth';
import { type ReactNode, type RefObject } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { getDiceBearAvatar } from '@/lib/utils';
import { type User } from '@/server/auth';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale('id', {
  relativeTime: {
    ...dayjs.Ls.id?.relativeTime,
    M: '1b',
    MM: '%db',
    d: '1h',
    dd: '%dh',
    h: '1j',
    hh: '%dj',
    m: '1m',
    mm: '%dm',
    s: 'Baru saja',
    y: '1t',
    yy: '%dt',
  },
});

const answerSchema = z.object({
  answer: z
    .string({ required_error: 'Jawaban tidak boleh kosong' })
    .min(1, 'Jawaban tidak boleh kosong')
    .max(500, 'Jawaban tidak boleh lebih dari 500 karakter'),
});

export function AnswerModal({
  children,
  question,
  session,
  user,
  clamped,
  containerRef,
  showButton,
  handleReadMore,
}: {
  children: ReactNode;
  question: {
    content: string;
    createdAt: Date;
    id: string;
    subject: {
      id: string;
      name: string;
    };
    updatedAt: Date;
  };
  session: Session;
  user: User;
  clamped: boolean;
  containerRef: RefObject<HTMLParagraphElement>;
  showButton: boolean;
  handleReadMore: () => void;
}) {
  const form = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
  });

  function onSubmit(values: z.infer<typeof answerSchema>) {
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
              <AvatarImage
                src={user.image ?? getDiceBearAvatar(user.username)}
              />
              <AvatarFallback>{user.initial}</AvatarFallback>
            </Avatar>
            <div className='grow space-y-1'>
              <div className='flex items-center space-x-2 text-[#696984]'>
                <Link
                  className='max-w-[6.25rem] cursor-pointer truncate font-medium decoration-2 hover:underline md:max-w-[12rem]'
                  href={`/users/${user.username}`}
                  title={user.name ?? user.username}
                >
                  {user.name}
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
                  title={dayjs(question.createdAt).format(
                    'dddd, D MMMM YYYY HH:mm:ss',
                  )}
                >
                  <span className='mr-2 text-sm font-medium'>·</span>
                  <span className='hover:underline'>
                    {dayjs(question.createdAt).locale('id').fromNow(true)}
                  </span>
                  {question.createdAt.toISOString() !==
                    question.updatedAt.toISOString() && (
                    <span
                      className='ml-1 hover:underline'
                      title={`Diedit pada ${dayjs(question.updatedAt).format(
                        'dddd, D MMMM YYYY HH:mm:ss',
                      )}`}
                    >
                      *
                    </span>
                  )}
                </div>
              </div>
              <p
                className={clsx(
                  'whitespace-pre-wrap py-1 text-left text-sm leading-relaxed text-[#696984]',
                  clamped
                    ? 'line-clamp-2 md:line-clamp-4'
                    : 'line-clamp-6 md:line-clamp-none',
                )}
                ref={containerRef}
              >
                {question.content}
              </p>
              {showButton && (
                <div className='flex justify-start'>
                  <button
                    className='mr-auto text-sm font-medium text-[#696984] hover:underline'
                    onClick={handleReadMore}
                  >
                    Tampilkan lebih {clamped ? 'banyak' : 'sedikit'}
                  </button>
                </div>
              )}
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
                <AvatarImage
                  src={
                    session?.user.image ??
                    getDiceBearAvatar(session?.user.username)
                  }
                />
                <AvatarFallback>{session.user.initial}</AvatarFallback>
              </Avatar>
              <div className='text-left text-[#696984]'>
                <Link
                  className='block max-w-full cursor-pointer truncate font-medium decoration-2 hover:underline'
                  href={`/users/${session.user.username}`}
                  title={session.user.name ?? session.user.username}
                >
                  {session.user.name}
                </Link>
                <Link
                  className='block max-w-full truncate font-normal'
                  href={`/users/${session.user.username}`}
                  title={`@${session.user.username}`}
                >
                  @{session.user.username}
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
