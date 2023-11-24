'use client';

import { DeleteModal } from '@/app/_components/delete-modal';
import { StarRating } from '@/app/_components/star-rating';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/_components/ui/avatar';
import { Badge } from '@/app/_components/ui/badge';
import { Button } from '@/app/_components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import { getDiceBearAvatar } from '@/lib/utils';
import { type User } from '@/server/auth';
import { api } from '@/trpc/react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { throttle } from 'lodash';
import {
  FacebookIcon,
  Heart,
  LinkIcon,
  MessageCircle,
  MoreHorizontalIcon,
  PencilIcon,
  Share2Icon,
  TrashIcon,
  TwitterIcon,
} from 'lucide-react';
import Link from 'next/link';
import { type Session } from 'next-auth';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

import { AnswerModal } from '../../questions/[id]/answer/answer-modal';
import { QuestionModal } from './question-modal';

dayjs.locale('id');

export function QuestionPost({
  highlightedWords,
  question,
  session,
  user,
}: {
  highlightedWords?: string[];
  question: {
    content: string;
    createdAt: Date;
    id: string;
    isFavorited?: boolean;
    numberOfAnswers: number;
    numberOfFavorites: number;
    rating?: number;
    subject: {
      id: string;
      name: string;
    };
    updatedAt: Date;
  };
  session: Session | null;
  user: User;
}) {
  const utils = api.useUtils();

  const favoriteMutation = api.favorite.toggleFavorite.useMutation({
    onError: () => toast.error('Gagal memberi favorit'),
    onSuccess: () => utils.question.findAllQuestions.invalidate(),
  });

  const handleFavorite = useMemo(
    () =>
      throttle(() => {
        if (session?.user) {
          // console.log('Liking...');
          favoriteMutation.mutate({
            questionId: question.id,
            userId: session.user.id,
          });
        }
      }, 2e3),
    [session, question, favoriteMutation],
  );

  return (
    <div className='flex space-x-3 border-b-2 p-4 transition hover:bg-slate-50'>
      <Avatar>
        <AvatarImage src={user.image ?? getDiceBearAvatar(user.username)} />
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
          <Link className='font-light' href={`/questions/${question.id}`}>
            <span className='mr-2 text-sm font-medium'>·</span>
            <span
              className='hover:underline md:hidden'
              title={dayjs(question.createdAt).format(
                'dddd, D MMMM YYYY HH:mm:ss',
              )}
            >
              {dayjs(question.createdAt).locale('id').fromNow(true)}
            </span>
            <span
              className='hidden hover:underline md:inline'
              title={dayjs(question.createdAt).format(
                'dddd, D MMMM YYYY HH:mm:ss',
              )}
            >
              {dayjs(question.createdAt).locale('id').fromNow()}
            </span>
            {question.createdAt.toISOString() !==
              question.updatedAt.toISOString() && (
              <span
                className='ml-2 hover:underline'
                title={`Diedit pada ${dayjs(question.updatedAt).format(
                  'dddd, D MMMM YYYY HH:mm:ss',
                )}`}
              >
                *
              </span>
            )}
          </Link>
        </div>
        <Link href={`/questions/${question.id}`}>
          <p className='py-1 text-sm leading-relaxed text-[#696984]'>
            {question.content.split(' ').map((word, idx) => {
              if (highlightedWords?.includes(word.toLowerCase())) {
                return (
                  <span key={idx}>
                    <span className='bg-[#F48C06] px-1 font-medium text-white'>
                      {word}
                    </span>{' '}
                  </span>
                );
              }
              return <span key={idx}>{word} </span>;
            })}
          </p>
        </Link>
        <div className='flex justify-between pt-2'>
          <div className='mr-2 space-x-1'>
            <Link href={`/subjects/${question.subject.id}`}>
              <Badge className='hover:bg-slate-200' variant='secondary'>
                <button>{question.subject.name}</button>
              </Badge>
            </Link>
          </div>
          {question.rating && <StarRating rating={question.rating} />}
        </div>
        <div className='flex flex-wrap gap-2 pt-2 text-[#696984]'>
          <Button
            className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
            disabled={!session || favoriteMutation.isLoading}
            onClick={handleFavorite}
            size='sm'
            title='Favorit'
            variant='outline'
          >
            <>
              {question.isFavorited ? (
                <Heart className='mr-1' color='red' fill='red' size={18} />
              ) : (
                <Heart className='mr-1' size={18} />
              )}
              {question.numberOfFavorites}
            </>
          </Button>
          {session ? (
            <AnswerModal question={question} session={session} user={user}>
              <Button
                className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
                size='sm'
                title='Beri jawaban mu'
                variant='outline'
              >
                <MessageCircle className='mr-1' size={18} />
                {question.numberOfAnswers}
              </Button>
            </AnswerModal>
          ) : (
            <Button
              className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
              disabled={true}
              size='sm'
              title='Beri jawaban mu'
              variant='outline'
            >
              <MessageCircle className='mr-1' size={18} />
              {question.numberOfAnswers}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
                size='sm'
                title='Bagikan'
                variant='outline'
              >
                <Share2Icon size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='text-[#696984]'>
              <DropdownMenuLabel>Bagikan ke...</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FacebookIcon className='mr-1' size={18} />
                <span>Facebook</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TwitterIcon className='mr-1' size={18} />
                <span>Twitter</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LinkIcon className='mr-1' size={18} />
                <span>Salin link</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {session?.user.id === user.id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
                  size='sm'
                  title='Lainnya'
                  variant='outline'
                >
                  <MoreHorizontalIcon size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='text-[#696984]'>
                <DropdownMenuLabel>Menu lainnya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <QuestionModal
                  defaultSubject={question.subject.id}
                  defaultValue={question.content}
                  title='Edit pertanyaan'
                  user={user}
                >
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <PencilIcon className='mr-1' size={18} />
                    <span>Edit</span>
                  </DropdownMenuItem>
                </QuestionModal>

                <DeleteModal
                  description='Apakah Anda yakin ingin menghapus pertanyaan ini?'
                  onClick={() => ''}
                  title='Hapus pertanyaan'
                >
                  <DropdownMenuItem
                    className='focus:bg-red-100 focus:text-red-900'
                    onSelect={(e) => e.preventDefault()}
                  >
                    <TrashIcon className='mr-1' size={18} />
                    <span>Hapus</span>
                  </DropdownMenuItem>
                </DeleteModal>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
