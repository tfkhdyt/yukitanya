'use client';

import dayjs from 'dayjs';
import {
  FacebookIcon,
  Heart,
  LinkIcon,
  MessageCircle,
  Share2Icon,
  TwitterIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type Session } from 'next-auth';
import toast from 'react-hot-toast';

import { AnswerModal } from '@/components/modals/answer-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getDiceBearAvatar } from '@/lib/utils';
import { type User } from '@/server/auth';
import { api } from '@/trpc/react';

type Question = {
  content: string;
  createdAt: Date;
  id: string;
  subject: {
    id: string;
    name: string;
  };
  updatedAt: Date;
  favorites: {
    userId: string;
  }[];
  numberOfAnswers: number;
};

export function DetailedQuestion({
  question,
  user,
  session,
}: {
  question: Question;
  user: User;
  session: Session | null;
}) {
  const router = useRouter();
  const favoriteMutation = api.favorite.toggleFavorite.useMutation({
    onError: () => toast.error('Gagal memberi favorit'),
    onSuccess: () => router.refresh(),
  });

  const handleFavorite = () => {
    if (session?.user) {
      favoriteMutation.mutate({
        questionId: question.id,
        userId: session.user.id,
      });
    }
  };

  return (
    <>
      <div className='border-b-2 p-4'>
        <div className='flex items-center space-x-3'>
          <Avatar className='h-12 w-12'>
            <AvatarImage src={user.image ?? getDiceBearAvatar(user.username)} />
            <AvatarFallback>{user.initial}</AvatarFallback>
          </Avatar>
          <div className='text-[#696984]'>
            <Link
              className='block max-w-full cursor-pointer truncate font-medium decoration-2 hover:underline'
              href={`/users/${user.username}`}
              title={user.name ?? user.username}
            >
              {user.name}
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

        <div className='my-2'>
          <p className='whitespace-pre-line py-1 text-sm leading-relaxed text-[#696984]'>
            {question.content}
          </p>
        </div>

        <div className='mt-4 flex flex-wrap-reverse items-center justify-between gap-4 md:flex-wrap'>
          <span className='flex flex-wrap items-center gap-1 text-sm font-medium text-[#696984]'>
            <p>
              {dayjs(question.createdAt).format('dddd, D MMMM YYYY, HH:mm')}
            </p>
            {question.createdAt.toISOString() !==
              question.updatedAt.toISOString() && (
              <span
                className='hover:underline'
                title={`Diedit pada ${dayjs(question.updatedAt).format(
                  'dddd, D MMMM YYYY HH:mm:ss',
                )}`}
              >
                *
              </span>
            )}
            <p>·</p>
            <p className='font-semibold'>{question.favorites.length} favorit</p>
            <p>·</p>
            <p className='font-semibold'>{question.numberOfAnswers} jawaban</p>
          </span>
          <div className='space-x-1'>
            <Link href={`/subjects/${question.subject.id}`}>
              <Badge className='hover:bg-slate-200' variant='secondary'>
                <button>{question.subject.name}</button>
              </Badge>
            </Link>
          </div>
        </div>
      </div>
      <div className='flex flex-wrap items-center justify-around border-b-2 py-2 text-[#696984] md:gap-2'>
        <Button
          className='space-x-2 rounded-full px-6 text-base hover:bg-slate-100 hover:text-[#696984]'
          size='sm'
          title={`Favorit (${question.favorites.length})`}
          variant='ghost'
          disabled={!session || favoriteMutation.isLoading}
          onClick={handleFavorite}
        >
          <>
            {question.favorites.some(
              (favorite) => favorite.userId === session?.user.id,
            ) ? (
              <Heart className='mr-1' color='red' fill='red' size={18} />
            ) : (
              <Heart className='mr-1' size={18} />
            )}
          </>
          <span className='hidden lg:inline'>Favorit</span>
        </Button>
        {session ? (
          <AnswerModal question={question} user={user} session={session}>
            <Button
              className='space-x-2 rounded-full px-6 text-base hover:bg-slate-100 hover:text-[#696984]'
              size='sm'
              title={`Jawab (${question.numberOfAnswers})`}
              variant='ghost'
            >
              <MessageCircle size={18} />
              <span className='hidden lg:inline'>Jawab</span>
            </Button>
          </AnswerModal>
        ) : (
          <Button
            className='space-x-2 rounded-full px-6 text-base hover:bg-slate-100 hover:text-[#696984]'
            size='sm'
            title={`Jawab (${question.numberOfAnswers})`}
            variant='ghost'
            disabled
          >
            <MessageCircle size={18} />
            <span className='hidden lg:inline'>Jawab</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className='space-x-2 rounded-full px-6 text-base hover:bg-slate-100 hover:text-[#696984]'
              size='sm'
              title='Bagikan'
              variant='ghost'
            >
              <Share2Icon size={18} />
              <span className='hidden lg:inline'>Bagikan</span>
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
      </div>
    </>
  );
}
