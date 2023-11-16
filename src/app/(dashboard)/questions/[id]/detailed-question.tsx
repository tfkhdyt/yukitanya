'use client';

import dayjs from 'dayjs';
import Link from 'next/link';

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
import { AnswerModal } from './answer/answer-modal';
import { QuestionModal } from '../../home/question/question-modal';

export function DetailedQuestion({
  user,
  post,
}: {
  user: {
    avatar: {
      imageUrl: string;
      fallback: string;
    };
    fullName: string;
    username: string;
  };
  post: {
    id: string;
    date: Date;
    content: string;
    subject: {
      id: string;
      name: string;
    };
    rating: number;
    numberOfAnswers: number;
    numberOfFavorites: number;
  };
}) {
  return (
    <>
      <div className='border-b-2 p-4'>
        <div className='flex items-center space-x-3'>
          <Avatar className='h-12 w-12'>
            <AvatarImage src={user.avatar.imageUrl} />
            <AvatarFallback>{user.avatar.fallback}</AvatarFallback>
          </Avatar>
          <div className='text-[#696984]'>
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

        <div className='my-2'>
          <p className='py-1 text-sm leading-relaxed text-[#696984]'>
            {post.content}
          </p>
        </div>

        <div className='mt-4 flex flex-wrap-reverse items-center justify-between gap-4 md:flex-wrap'>
          <span className='flex flex-wrap items-center gap-1 text-sm font-medium text-[#696984]'>
            <p>{dayjs(post.date).format('dddd, D MMMM YYYY, HH:mm')}</p>
            <p>·</p>
            <p className='font-semibold'>{post.numberOfFavorites} favorit</p>
            <p>·</p>
            <p className='font-semibold'>{post.numberOfAnswers} jawaban</p>
          </span>
          <div className='space-x-1'>
            <Link href={`/subjects/${post.subject.id}`}>
              <Badge variant='secondary' className='hover:bg-slate-200'>
                <button>{post.subject.name}</button>
              </Badge>
            </Link>
          </div>
        </div>
      </div>
      <div className='flex flex-wrap items-center justify-around border-b-2 py-2 text-[#696984] md:gap-2'>
        <Button
          size='sm'
          variant='ghost'
          className='space-x-2 rounded-full px-6 text-base hover:bg-slate-100 hover:text-[#696984]'
          title={`Favorit (${post.numberOfFavorites})`}
        >
          <Heart size={18} />
          <span className='hidden lg:inline'>Favorit</span>
        </Button>
        <AnswerModal user={user} post={post}>
          <Button
            size='sm'
            variant='ghost'
            className='space-x-2 rounded-full px-6 text-base hover:bg-slate-100 hover:text-[#696984]'
            title={`Jawab (${post.numberOfAnswers})`}
          >
            <MessageCircle size={18} />
            <span className='hidden lg:inline'>Jawab</span>
          </Button>
        </AnswerModal>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size='sm'
              variant='ghost'
              className='space-x-2 rounded-full px-6 text-base hover:bg-slate-100 hover:text-[#696984]'
              title='Bagikan'
            >
              <Share2Icon size={18} />
              <span className='hidden lg:inline'>Bagikan</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='text-[#696984]'>
            <DropdownMenuLabel>Bagikan ke...</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <FacebookIcon size={18} className='mr-1' />
              <span>Facebook</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TwitterIcon size={18} className='mr-1' />
              <span>Twitter</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LinkIcon size={18} className='mr-1' />
              <span>Salin link</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size='sm'
              variant='ghost'
              className='space-x-2 rounded-full px-6 text-base hover:bg-slate-100 hover:text-[#696984]'
              title='Lainnya'
            >
              <MoreHorizontalIcon size={18} />
              <span className='hidden lg:inline'>Lainnya</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='text-[#696984]'>
            <DropdownMenuLabel>Menu lainnya</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <QuestionModal
              fullName='Taufik Hidayat'
              username='tfkhdyt'
              avatar={{
                imageUrl: 'https://github.com/tfkhdyt.png',
                fallback: 'TH',
              }}
              title='Edit pertanyaan'
              defaultValue={post.content}
              defaultSubject={post.subject.id}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <PencilIcon size={18} className='mr-1' />
                <span>Edit</span>
              </DropdownMenuItem>
            </QuestionModal>
            <DropdownMenuItem className='focus:bg-red-100 focus:text-red-900'>
              <TrashIcon size={18} className='mr-1' />
              <span>Hapus</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
