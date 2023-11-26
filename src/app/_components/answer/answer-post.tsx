'use client';

import 'dayjs/locale/id';

import clsx from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { debounce } from 'lodash';
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
import { type Session } from 'next-auth';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

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
import { api } from '@/trpc/react';

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
  owner: User;
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
  session,
}: {
  answer: Answer;
  question: Question;
  session: Session | null;
}) {
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [clamped, setClamped] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const containerReference = useRef<HTMLParagraphElement>(null);

  const handleReadMore = () => setClamped((v) => !v);

  useEffect(() => {
    const hasClamping = (element: HTMLParagraphElement) => {
      const { clientHeight, scrollHeight } = element;
      return clientHeight !== scrollHeight;
    };

    const checkButtonAvailability = () => {
      if (containerReference.current) {
        const hadClampClass =
          containerReference.current.classList.contains('line-clamp-4');
        if (!hadClampClass)
          containerReference.current.classList.add('line-clamp-4');
        setShowButton(hasClamping(containerReference.current));
        if (!hadClampClass)
          containerReference.current.classList.remove('line-clamp-4');
      }
    };

    const debouncedCheck = debounce(checkButtonAvailability, 50);

    checkButtonAvailability();
    window.addEventListener('resize', debouncedCheck);

    return () => {
      window.removeEventListener('resize', debouncedCheck);
    };
  }, [containerReference, question]);

  const utils = api.useUtils();
  const deleteAnswerMutation = api.answer.deleteAnswerById.useMutation({
    onError: () => toast.error('Gagal menghapus jawaban'),
    onSuccess: async () => {
      toast.success('Jawaban telah dihapus!');
      setIsShowDeleteModal(false);
      await utils.answer.findAllAnswersByQuestionId.invalidate();
      await utils.question.findQuestionMetadata.invalidate();
    },
  });

  const handleDelete = (id: string) => {
    deleteAnswerMutation.mutate(id);
  };

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
          <AvatarImage
            src={answer.owner.image ?? getDiceBearAvatar(answer.owner.username)}
          />
          <AvatarFallback>{answer.owner.initial}</AvatarFallback>
        </Avatar>
        <div className='grow space-y-1'>
          <div className='flex items-center space-x-2 text-[#696984]'>
            <span
              className='max-w-[6.25rem] cursor-pointer truncate font-medium decoration-2 hover:underline md:max-w-[12rem]'
              title={answer.owner.name ?? answer.owner.username}
            >
              {answer.owner.name}
            </span>
            <span
              className='max-w-[6.25rem] truncate font-normal md:max-w-[12rem]'
              title={`@${answer.owner.username}`}
            >
              @{answer.owner.username}
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
          <p
            className={clsx(
              'whitespace-pre-wrap text-sm leading-relaxed text-[#696984]',
              clamped && 'line-clamp-4',
            )}
            ref={containerReference}
          >
            {answer.content}
          </p>
          {showButton && (
            <button
              className='text-sm font-medium text-[#696984] hover:underline'
              onClick={handleReadMore}
            >
              Tampilkan lebih {clamped ? 'banyak' : 'sedikit'}
            </button>
          )}
          <div className='flex flex-wrap-reverse items-center gap-4 pt-2 text-[#696984] md:flex-wrap md:justify-between'>
            <div className='flex flex-wrap gap-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
                    size='sm'
                    title='Beri nilai'
                    variant='outline'
                    disabled={!session}
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
              {question.owner.id === session?.user.id && (
                <Button
                  className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
                  size='sm'
                  title='Tandai sebagai jawaban terbaik'
                  variant='outline'
                >
                  <CheckCircle size={18} />
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
              {answer.owner.id === session?.user.id && (
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
                      session={session}
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
                      onClick={() => handleDelete(answer.id)}
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
              )}
            </div>
            {answer.rating > 0 && (
              <div>
                <StarRating rating={answer.rating} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
