'use client';

import 'dayjs/locale/id';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
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
import { useState } from 'react';

import { DeleteModal } from '@/components/modals/delete-modal';
import { EditAnswerModal } from '@/components/modals/edit-answer-modal';
import { StarRating } from '@/components/star-rating';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

dayjs.locale('id');
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

type Answer = {
  content: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
  isBestAnswer: boolean;
  numberOfVotes: number;
  rating: number;
};

type Question = {
  content: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
  subject: {
    id: string;
    name: string;
  };
  owner: User;
};

export function AnswerPost({
  answer,
  question,
  user,
}: {
  answer: Answer;
  question: Question;
  user: User;
}) {
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);

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
          <AvatarImage src={user.image ?? getDiceBearAvatar(user.username)} />
          <AvatarFallback>{user.initial}</AvatarFallback>
        </Avatar>
        <div className='grow space-y-1'>
          <div className='flex items-center space-x-2 text-[#696984]'>
            <span
              className='max-w-[6.25rem] cursor-pointer truncate font-medium decoration-2 hover:underline md:max-w-[12rem]'
              title={user.name ?? user.username}
            >
              {user.name}
            </span>
            <span
              className='max-w-[6.25rem] truncate font-normal md:max-w-[12rem]'
              title={`@${user.username}`}
            >
              @{user.username}
            </span>
            <span
              className='font-light'
              title={dayjs(answer.createdAt).format(
                'dddd, D MMMM YYYY HH:mm:ss',
              )}
            >
              <span className='mr-2 text-sm font-medium'>·</span>
              <span className='hover:underline'>
                {dayjs(answer.createdAt).fromNow(true)}
              </span>
            </span>
          </div>
          <p className='whitespace-pre-wrap text-sm leading-relaxed text-[#696984]'>
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
                    question={{
                      content: question.content,
                      createdAt: question.createdAt,
                      subject: question.subject,
                      updatedAt: question.updatedAt,
                      owner: question.owner,
                    }}
                    user={user}
                  >
                    <DropdownMenuItem
                      onSelect={(event) => event.preventDefault()}
                    >
                      <PencilIcon className='mr-1' size={18} />
                      <span>Edit</span>
                    </DropdownMenuItem>
                  </EditAnswerModal>
                  <DeleteModal
                    description='Apakah Anda yakin ingin menghapus jawaban ini?'
                    onClick={() => ''}
                    onOpenChange={setIsShowDeleteModal}
                    open={isShowDeleteModal}
                    title='Hapus jawaban'
                  >
                    <DropdownMenuItem
                      className='focus:bg-red-100 focus:text-red-900'
                      onSelect={(event) => event.preventDefault()}
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
