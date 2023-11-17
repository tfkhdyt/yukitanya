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
import { AnswerModal } from '../../questions/[id]/answer/answer-modal';
import { QuestionModal } from './question-modal';
import { DeleteModal } from '@/app/_components/delete-modal';

export function QuestionPost({
  user,
  question,
  highlightedWords,
}: {
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
    rating: number;
    numberOfAnswers: number;
    numberOfFavorites: number;
    isFavorited?: boolean;
  };
  highlightedWords?: string[];
}) {
  return (
    <div className='flex space-x-3 border-b-2 p-4 transition hover:bg-slate-50'>
      <Avatar>
        <AvatarImage src={user.avatar.imageUrl} />
        <AvatarFallback>{user.avatar.fallback}</AvatarFallback>
      </Avatar>
      <div className='grow space-y-1'>
        <div className='flex items-center space-x-2 text-[#696984]'>
          <Link
            href={`/users/${user.username}`}
            className='max-w-[6.25rem] cursor-pointer truncate font-medium decoration-2 hover:underline md:max-w-[12rem]'
            title={user.fullName}
          >
            {user.fullName}
          </Link>
          <Link
            href={`/users/${user.username}`}
            className='max-w-[6.25rem] truncate font-normal md:max-w-[12rem]'
            title={`@${user.username}`}
          >
            @{user.username}
          </Link>
          <Link
            href={`/questions/${question.id}`}
            className='font-light'
            title={dayjs(question.date).format('dddd, D MMMM YYYY HH:mm:ss')}
          >
            <span className='mr-2 text-sm font-medium'>·</span>
            <span className='hover:underline md:hidden'>
              {dayjs(question.date).locale('id').fromNow(true)}
            </span>
            <span className='hidden hover:underline md:inline'>
              {dayjs(question.date).locale('id').fromNow()}
            </span>
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
              <Badge variant='secondary' className='hover:bg-slate-200'>
                <button>{question.subject.name}</button>
              </Badge>
            </Link>
          </div>
          <StarRating rating={question.rating} />
        </div>
        <div className='flex flex-wrap gap-2 pt-2 text-[#696984]'>
          <Button
            size='sm'
            variant='outline'
            className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
            title='Favorit'
          >
            {question.isFavorited ? (
              <Heart size={18} color='red' fill='red' className='mr-1' />
            ) : (
              <Heart size={18} className='mr-1' />
            )}
            {question.numberOfFavorites}
          </Button>
          <AnswerModal user={user} question={question}>
            <Button
              size='sm'
              variant='outline'
              className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
              title='Beri jawaban mu'
            >
              <MessageCircle size={18} className='mr-1' />
              {question.numberOfAnswers}
            </Button>
          </AnswerModal>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size='sm'
                variant='outline'
                className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
                title='Bagikan'
              >
                <Share2Icon size={18} />
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
                variant='outline'
                className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
                title='Lainnya'
              >
                <MoreHorizontalIcon size={18} />
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
                defaultValue={question.content}
                defaultSubject={question.subject.id}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <PencilIcon size={18} className='mr-1' />
                  <span>Edit</span>
                </DropdownMenuItem>
              </QuestionModal>

              <DeleteModal
                title='Hapus pertanyaan'
                description='Apakah Anda yakin ingin menghapus pertanyaan ini?'
                onClick={() => ''}
              >
                <DropdownMenuItem
                  className='focus:bg-red-100 focus:text-red-900'
                  onSelect={(e) => e.preventDefault()}
                >
                  <TrashIcon size={18} className='mr-1' />
                  <span>Hapus</span>
                </DropdownMenuItem>
              </DeleteModal>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
