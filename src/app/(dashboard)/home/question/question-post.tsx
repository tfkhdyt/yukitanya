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

import { AnswerModal } from '../../questions/[id]/answer/answer-modal';
import { QuestionModal } from './question-modal';

export function QuestionPost({
  highlightedWords,
  question,
  user,
}: {
  highlightedWords?: string[];
  question: {
    content: string;
    date: Date;
    id: string;
    isFavorited?: boolean;
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
    <div className='flex space-x-3 border-b-2 p-4 transition hover:bg-slate-50'>
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
          <Link
            className='font-light'
            href={`/questions/${question.id}`}
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
              <Badge className='hover:bg-slate-200' variant='secondary'>
                <button>{question.subject.name}</button>
              </Badge>
            </Link>
          </div>
          <StarRating rating={question.rating} />
        </div>
        <div className='flex flex-wrap gap-2 pt-2 text-[#696984]'>
          <Button
            className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
            size='sm'
            title='Favorit'
            variant='outline'
          >
            {question.isFavorited ? (
              <Heart className='mr-1' color='red' fill='red' size={18} />
            ) : (
              <Heart className='mr-1' size={18} />
            )}
            {question.numberOfFavorites}
          </Button>
          <AnswerModal question={question} user={user}>
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
      </div>
    </div>
  );
}
