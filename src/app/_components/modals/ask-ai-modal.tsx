'use client';

import clsx from 'clsx';
import type { Session } from 'next-auth';
import Link from 'next/link';
import { type ReactNode, useState } from 'react';
import Markdown from 'react-markdown';

import { badgeVariants } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatLongDateTime, getFromNowTime } from '@/lib/datetime';
import type { User } from '@/server/auth';

import { api } from '@/trpc/react';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { match } from 'ts-pattern';
import { AvatarWithBadge } from '../avatar-with-badge';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

type Question = {
  id: string;
  content: string;
  createdAt: Date;
  subject: {
    id: string;
    name: string;
  };
  updatedAt: Date;
  owner: User;
};

export function AskAIModal({
  children,
  question,
}: {
  children: ReactNode;
  question: Question;
  session: Session;
}) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = api.answer.askAI.useQuery(question.content, {
    enabled: open,
    staleTime: Number.POSITIVE_INFINITY,
    cacheTime: Number.POSITIVE_INFINITY,
  });

  const [copied, setCopied] = useState(false);
  const handleCopy = async (text?: string | undefined) => {
    if (!text) return;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='md:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Tanyakan pada AI</DialogTitle>
          <div className='-mx-4 flex space-x-3 border-b-2 p-4'>
            <Link
              href={`/users/${question.owner.username}`}
              aria-label={question.owner.username}
              className='h-fit'
            >
              <AvatarWithBadge user={question.owner} />
            </Link>
            <div className='grow space-y-1'>
              <div className='flex items-center space-x-2 text-[#696984] max-w-full'>
                <Link
                  className='cursor-pointer font-medium decoration-2 hover:underline break-all line-clamp-1 max-w-[38%] md:max-w-[50%]'
                  href={`/users/${question.owner.username}`}
                  title={question.owner.name ?? question.owner.username}
                >
                  {question.owner.name}
                </Link>
                <Link
                  className='font-normal break-all line-clamp-1 max-w-[23%] md:max-w-[34%]'
                  href={`/users/${question.owner.username}`}
                  title={`@${question.owner.username}`}
                >
                  @{question.owner.username}
                </Link>
                <div className='font-light'>
                  <span className='mr-2 text-sm font-medium'>·</span>
                  <span
                    className='hover:underline'
                    title={formatLongDateTime(question.createdAt)}
                  >
                    {getFromNowTime(question.createdAt)}
                  </span>
                  {question.createdAt.toISOString() !==
                    question.updatedAt.toISOString() && (
                    <span
                      className='ml-1 hover:underline'
                      title={`Diedit pada ${formatLongDateTime(
                        question.updatedAt,
                      )}`}
                    >
                      *
                    </span>
                  )}
                </div>
              </div>
              <p className='line-clamp-4 whitespace-pre-wrap text-left text-sm leading-relaxed text-[#696984]'>
                {question.content.replace(/<\/?mark>/g, '')}
              </p>
              <div className='flex justify-start'>
                <Link
                  href={`/subjects/${question.subject.id}`}
                  className={clsx(
                    badgeVariants({ variant: 'secondary' }),
                    'mt-4 hover:bg-gray-200',
                  )}
                >
                  {question.subject.name}
                </Link>
              </div>
            </div>
          </div>
          <div className='pt-2'>
            <div className='flex items-center space-x-3'>
              <div aria-label='Yukitanya AI'>
                <AvatarWithBadge
                  user={{
                    id: 'yukitanya',
                    name: 'Yukitanya AI',
                    username: 'yukitanya',
                    initial: 'AI',
                  }}
                />
              </div>
              <div className='text-left text-[#696984]'>
                <div
                  className='block max-w-[16rem] md:max-w-md cursor-pointer truncate font-medium decoration-2 hover:underline'
                  title='Yukitanya AI'
                >
                  Yukitanya AI
                </div>
                <div
                  className='block max-w-[16rem] md:max-w-md truncate font-normal'
                  title='@yukitanya'
                >
                  @yukitanya
                </div>
              </div>
            </div>

            <div className='space-y-2 py-2 text-[#696984] mt-2'>
              {match(isLoading)
                .with(true, () => (
                  <>
                    <Skeleton className='w-full h-5 rounded-md' />
                    <Skeleton className='w-full h-5 rounded-md' />
                    <Skeleton className='w-1/2 h-5 rounded-md' />
                  </>
                ))
                .with(false, () => {
                  if (data) {
                    return (
                      <Markdown className='whitespace-pre-wrap text-left text-sm leading-relaxed max-h-52 overflow-y-auto'>
                        {data}
                      </Markdown>
                    );
                  }
                })
                .exhaustive()}
              <div className='flex pt-2'>
                {data && (
                  <Button
                    variant='outline'
                    className='ml-auto rounded-full'
                    onClick={async () => handleCopy(data)}
                  >
                    {copied ? (
                      <>
                        <CheckIcon className='mr-2' size={20} />
                        Tersalin!
                      </>
                    ) : (
                      <>
                        <CopyIcon className='mr-2' size={20} />
                        Salin jawaban
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
