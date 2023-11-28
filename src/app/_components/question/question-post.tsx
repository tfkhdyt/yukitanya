'use client';

import clsx from 'clsx';
import { debounce } from 'lodash';
import {
  Heart,
  MessageCircle,
  MoreHorizontalIcon,
  PencilIcon,
  Share2Icon,
  TrashIcon,
} from 'lucide-react';
import Link from 'next/link';
import { type Session } from 'next-auth';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { AnswerModal } from '@/components/modals/answer-modal';
import { DeleteModal } from '@/components/modals/delete-modal';
import { EditQuestionModal } from '@/components/modals/edit-question-modal';
import { StarRating } from '@/components/star-rating';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { environment } from '@/environment.mjs';
import { formatLongDateTime, getFromNowTime } from '@/lib/datetime';
import { getDiceBearAvatar } from '@/lib/utils';
import { type User } from '@/server/auth';
import { api } from '@/trpc/react';

import { ShareDropdown } from '../dropdown/share-dropdown';

type Question = {
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
  slug: string;
  owner: User;
};

export function QuestionPost({
  highlightedWords,
  question,
  session,
}: {
  highlightedWords?: string[];
  question: Question;
  session: Session | null;
}) {
  const utils = api.useUtils();
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isShowDropdown, setIsShowDropDown] = useState(false);
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

  const favoriteMutation = api.favorite.toggleFavorite.useMutation({
    onError: () => toast.error('Gagal memberi favorit'),
    onSuccess: () => utils.question.invalidate(),
  });

  const deleteQuestionMutation = api.question.deleteQuestionById.useMutation({
    onError: () => toast.error('Gagal menghapus pertanyaan'),
    onSuccess: async () => {
      toast.success('Pertanyaan telah dihapus!');
      setIsShowDeleteModal(false);
      await utils.question.invalidate();
    },
  });

  const handleFavorite = () => {
    if (session?.user) {
      favoriteMutation.mutate({
        questionId: question.id,
        userId: session.user.id,
      });
    }
  };

  const handleDeleteQuestion = (id: string) => {
    deleteQuestionMutation.mutate(id);
  };

  return (
    <div className='flex space-x-3 border-b-2 p-4 transition hover:bg-slate-50'>
      <Avatar>
        <AvatarImage
          src={
            question.owner.image ?? getDiceBearAvatar(question.owner.username)
          }
        />
        <AvatarFallback>{question.owner.initial}</AvatarFallback>
      </Avatar>
      <div className='grow space-y-1'>
        <div className='flex items-center space-x-2 text-[#696984]'>
          <Link
            className='max-w-[6.25rem] cursor-pointer truncate font-medium decoration-2 hover:underline md:max-w-[12rem]'
            href={`/users/${question.owner.username}`}
            title={question.owner.name ?? question.owner.username}
          >
            {question.owner.name}
          </Link>
          <Link
            className='max-w-[6.25rem] truncate font-normal md:max-w-[12rem]'
            href={`/users/${question.owner.username}`}
            title={`@${question.owner.username}`}
          >
            @{question.owner.username}
          </Link>
          <Link className='font-light' href={`/questions/${question.slug}`}>
            <span className='mr-2 text-sm font-medium'>·</span>
            <span
              className='hover:underline'
              title={formatLongDateTime(question.createdAt)}
            >
              {getFromNowTime(question.createdAt)}
            </span>
            {question.createdAt.getTime() !== question.updatedAt.getTime() && (
              <span
                className='ml-1 hover:underline'
                title={`Diedit pada ${formatLongDateTime(question.updatedAt)}`}
              >
                *
              </span>
            )}
          </Link>
        </div>
        <Link href={`/questions/${question.slug}`}>
          <p
            className={clsx(
              'whitespace-pre-wrap py-1 text-sm leading-relaxed text-[#696984]',
              clamped && 'line-clamp-4',
            )}
            ref={containerReference}
          >
            {question.content.split(' ').map((word, index) => {
              if (highlightedWords?.includes(word.toLowerCase())) {
                return (
                  <span key={index}>
                    <span className='bg-[#F48C06] px-1 font-medium text-white'>
                      {word}
                    </span>{' '}
                  </span>
                );
              }
              return <span key={index}>{word} </span>;
            })}
          </p>
        </Link>
        {showButton && (
          <button
            className='text-sm font-medium text-[#696984] hover:underline'
            onClick={handleReadMore}
          >
            Tampilkan lebih {clamped ? 'banyak' : 'sedikit'}
          </button>
        )}
        <div className='flex justify-between pt-4'>
          <div className='mr-2 space-x-1'>
            <Link href={`/subjects/${question.subject.id}`}>
              <Badge className='hover:bg-slate-200' variant='secondary'>
                <button>{question.subject.name}</button>
              </Badge>
            </Link>
          </div>
          {question.rating && (
            <div className='flex items-center gap-1'>
              <span className='text-[#696984]'>({question.rating})</span>
              <StarRating rating={question.rating} />
            </div>
          )}
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
            <AnswerModal question={question} session={session}>
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
              disabled
              size='sm'
              title='Beri jawaban mu'
              variant='outline'
            >
              <MessageCircle className='mr-1' size={18} />
              {question.numberOfAnswers}
            </Button>
          )}

          <ShareDropdown
            url={
              new URL(
                `/questions/${question.slug}`,
                environment.NEXT_PUBLIC_BASE_PATH,
              )
            }
          >
            <Button
              className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
              size='sm'
              title='Bagikan'
              variant='outline'
            >
              <Share2Icon size={18} />
            </Button>
          </ShareDropdown>
          {session?.user.id === question.owner.id && (
            <DropdownMenu
              onOpenChange={setIsShowDropDown}
              open={isShowDropdown}
            >
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
                <EditQuestionModal
                  question={question}
                  setShowDropdown={setIsShowDropDown}
                >
                  <DropdownMenuItem
                    className='cursor-pointer'
                    onSelect={(event) => event.preventDefault()}
                  >
                    <PencilIcon className='mr-2' size={18} />
                    <span>Edit</span>
                  </DropdownMenuItem>
                </EditQuestionModal>

                <DeleteModal
                  description='Apakah Anda yakin ingin menghapus pertanyaan ini?'
                  onClick={() => handleDeleteQuestion(question.id)}
                  onOpenChange={setIsShowDeleteModal}
                  open={isShowDeleteModal}
                  title='Hapus pertanyaan'
                >
                  <DropdownMenuItem
                    className='cursor-pointer focus:bg-red-100 focus:text-red-900'
                    onSelect={(event) => event.preventDefault()}
                  >
                    <TrashIcon className='mr-2' size={18} />
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
