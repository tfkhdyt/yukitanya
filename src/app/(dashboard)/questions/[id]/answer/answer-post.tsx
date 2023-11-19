'use client';

import { DeleteModal } from '@/app/_components/delete-modal';
import { StarRating } from '@/app/_components/star-rating';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/app/_components/ui/alert';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/_components/ui/avatar';
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
  CheckCircle,
  FacebookIcon,
  LinkIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Share2Icon,
  Star,
  StarIcon,
  TrashIcon,
  TwitterIcon,
} from 'lucide-react';

import { EditAnswerModal } from './edit-answer-modal';

export function AnswerPost({
  answer,
  question,
  user,
}: {
  answer: {
    content: string;
    date: Date;
    id: string;
    isBestAnswer: boolean;
    numberOfVotes: number;
    rating: number;
  };
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
    user: {
      avatar: {
        fallback: string;
        imageUrl: string;
      };
      fullName: string;
      username: string;
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
    <section id={answer.id}>
      {answer.isBestAnswer && (
        <div className='px-4 pt-4'>
          <Alert className='border-green-600 bg-green-50'>
            <CheckCircle className='h-4 w-4' color='#16A34A' />
            <AlertTitle className='text-green-600'>Jawaban Terbaik!</AlertTitle>
            <AlertDescription className='text-green-800'>
              Pemilik pertanyaan menerima ini sebagai jawaban terbaik.
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className='flex space-x-3 border-b-2 p-4'>
        <Avatar>
          <AvatarImage src={user.avatar.imageUrl} />
          <AvatarFallback>{user.avatar.fallback}</AvatarFallback>
        </Avatar>
        <div className='grow space-y-1'>
          <div className='flex items-center space-x-2 text-[#696984]'>
            <span
              className='max-w-[6.25rem] cursor-pointer truncate font-medium decoration-2 hover:underline md:max-w-[12rem]'
              title={user.fullName}
            >
              {user.fullName}
            </span>
            <span
              className='max-w-[6.25rem] truncate font-normal md:max-w-[12rem]'
              title={`@${user.username}`}
            >
              @{user.username}
            </span>
            <span
              className='font-light'
              title={dayjs(answer.date).format('dddd, D MMMM YYYY HH:mm:ss')}
            >
              <span className='mr-2 text-sm font-medium'>·</span>
              <span className='hover:underline md:hidden'>
                {dayjs(answer.date).fromNow(true)}
              </span>
              <span className='hidden hover:underline md:inline'>
                {dayjs(answer.date).fromNow()}
              </span>
            </span>
          </div>
          <p className='py-1 text-sm leading-relaxed text-[#696984]'>
            {answer.content}
          </p>
          <div className='flex flex-wrap-reverse items-center gap-4 pt-2 text-[#696984] md:flex-wrap md:justify-between'>
            <div className='flex flex-wrap gap-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
                    size='sm'
                    title='Beri nilai'
                    variant='outline'
                  >
                    <Star className='mr-2' size={18} />
                    <span>{answer.numberOfVotes}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='text-[#696984]'>
                  <DropdownMenuLabel>Beri nilai</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className='flex justify-center p-2' dir='rtl'>
                    <StarIcon
                      className='peer fill-white hover:fill-[#F48C06] peer-hover:fill-[#F48C06]'
                      color='#F48C06'
                    />
                    <StarIcon
                      className='peer fill-white hover:fill-[#F48C06] peer-hover:fill-[#F48C06]'
                      color='#F48C06'
                    />
                    <StarIcon
                      className='peer fill-white hover:fill-[#F48C06] peer-hover:fill-[#F48C06]'
                      color='#F48C06'
                    />
                    <StarIcon
                      className='peer fill-white hover:fill-[#F48C06] peer-hover:fill-[#F48C06]'
                      color='#F48C06'
                    />
                    <StarIcon
                      className='peer fill-white hover:fill-[#F48C06] peer-hover:fill-[#F48C06]'
                      color='#F48C06'
                    />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
                size='sm'
                title='Jawaban terbaik'
                variant='outline'
              >
                <CheckCircle size={18} />
              </Button>
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
                  <EditAnswerModal
                    defaultValue={answer.content}
                    question={question}
                    user={user}
                  >
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <PencilIcon className='mr-1' size={18} />
                      <span>Edit</span>
                    </DropdownMenuItem>
                  </EditAnswerModal>
                  <DeleteModal
                    description='Apakah Anda yakin ingin menghapus jawaban ini?'
                    onClick={() => ''}
                    title='Hapus jawaban'
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
            <div>
              <StarRating rating={answer.rating} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
