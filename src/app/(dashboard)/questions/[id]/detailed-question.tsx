'use client';

import dayjs from 'dayjs';
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

import { DeleteModal } from '@/app/_components/delete-modal';
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

import { QuestionModal } from '../../home/question/question-modal';
import { AnswerModal } from './answer/answer-modal';

export function DetailedQuestion({
  question,
  user,
}: {
  question: {
    content: string;
    date: Date;
    id: string;
    numberOfAnswers: number;
    numberOfFavorites: number;
    rating: number;
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

        <div className='my-2'>
          <p className='py-1 text-sm leading-relaxed text-[#696984]'>
            {question.content}
          </p>
        </div>

        <div className='mt-4 flex flex-wrap-reverse items-center justify-between gap-4 md:flex-wrap'>
          <span className='flex flex-wrap items-center gap-1 text-sm font-medium text-[#696984]'>
            <p>{dayjs(question.date).format('dddd, D MMMM YYYY, HH:mm')}</p>
            <p>·</p>
            <p className='font-semibold'>
              {question.numberOfFavorites} favorit
            </p>
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
          title={`Favorit (${question.numberOfFavorites})`}
          variant='ghost'
        >
          <Heart size={18} />
          <span className='hidden lg:inline'>Favorit</span>
        </Button>
        <AnswerModal question={question} user={user}>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className='space-x-2 rounded-full px-6 text-base hover:bg-slate-100 hover:text-[#696984]'
              size='sm'
              title='Lainnya'
              variant='ghost'
            >
              <MoreHorizontalIcon size={18} />
              <span className='hidden lg:inline'>Lainnya</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='text-[#696984]'>
            <DropdownMenuLabel>Menu lainnya</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <QuestionModal
              avatar={{
                fallback: 'TH',
                imageUrl: 'https://github.com/tfkhdyt.png',
              }}
              defaultSubject={question.subject.id}
              defaultValue={question.content}
              fullName='Taufik Hidayat'
              title='Edit pertanyaan'
              username='tfkhdyt'
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
      </div>
    </>
  );
}
