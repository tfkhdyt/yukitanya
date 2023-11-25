import clsx from 'clsx';
import {
  CheckCircle,
  CheckIcon,
  HeartIcon,
  MessageCircleIcon,
  StarIcon,
} from 'lucide-react';
import Link from 'next/link';
import { match } from 'ts-pattern';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Properties = {
  description: string;
  hasBeenRead: boolean;
  questionId: string;
  timestamp: Date;
  user: {
    avatar: {
      fallback: string;
      imageUrl: string;
    };
    fullName: string;
    username: string;
  };
} & (
  | {
      answerId: string;
      rating: number;
      type: 'rating';
    }
  | {
      answerId: string;
      type: 'best-answer' | 'new-answer';
    }
  | {
      type: 'favorite';
    }
);

export function NotificationItem(properties: Properties) {
  return (
    <section
      className={clsx(
        'border-b-2 p-4 text-[#696984] transition',
        properties.hasBeenRead
          ? 'hover:bg-slate-50'
          : 'bg-slate-50 hover:bg-slate-100',
      )}
    >
      {match(properties)
        .with({ type: 'favorite' }, (notif) => (
          <>
            <div className='flex items-center space-x-4'>
              <HeartIcon color='red' fill='red' size={28} />
              <Link href={`/users/${properties.user.username}`}>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={properties.user.avatar.imageUrl} />
                  <AvatarFallback>
                    {properties.user.avatar.fallback}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
            <div className='ml-12 mt-2 flex items-center justify-between gap-4'>
              <span className='text-sm font-medium'>
                <Link
                  className='hover:underline'
                  href={`/users/${properties.user.username}`}
                >
                  {properties.user.fullName}
                </Link>{' '}
                <Link href={`/questions/${properties.questionId}`}>
                  menyukai pertanyaan Anda
                </Link>
                <Link
                  className='mt-2 block text-sm font-normal'
                  href={`/questions/${properties.questionId}`}
                >
                  {notif.description}
                </Link>
              </span>

              {properties.hasBeenRead || (
                <button title='Tandai sudah dibaca'>
                  <CheckIcon />
                </button>
              )}
            </div>
          </>
        ))
        .with({ type: 'rating' }, (notif) => (
          <>
            <div className='flex items-center space-x-4'>
              <StarIcon color='#F48C06' fill='#F48C06' size={28} />
              <Link href={`/users/${properties.user.username}`}>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={properties.user.avatar.imageUrl} />
                  <AvatarFallback>
                    {properties.user.avatar.fallback}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
            <div className='ml-12 mt-2 flex items-center justify-between gap-4'>
              <span className='text-sm font-medium'>
                <Link
                  className='hover:underline'
                  href={`/users/${properties.user.username}`}
                >
                  {properties.user.fullName}
                </Link>{' '}
                <Link
                  href={`/questions/${properties.questionId}#${notif.answerId}`}
                >
                  memberi nilai terhadap jawaban Anda ({notif.rating})
                </Link>
                <Link
                  className='mt-2 block text-sm font-normal'
                  href={`/questions/${properties.questionId}#${notif.answerId}`}
                >
                  {notif.description}
                </Link>
              </span>

              {properties.hasBeenRead || (
                <button title='Tandai sudah dibaca'>
                  <CheckIcon />
                </button>
              )}
            </div>
          </>
        ))
        .with({ type: 'new-answer' }, (notif) => (
          <>
            <div className='flex items-center space-x-4'>
              <MessageCircleIcon color='#6364FF' size={28} />
              <Link href={`/users/${properties.user.username}`}>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={properties.user.avatar.imageUrl} />
                  <AvatarFallback>
                    {properties.user.avatar.fallback}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
            <div className='ml-12 mt-2 flex items-end justify-between gap-4'>
              <div className='text-sm font-medium'>
                <Link
                  className='hover:underline'
                  href={`/users/${properties.user.username}`}
                >
                  {properties.user.fullName}
                </Link>{' '}
                <Link
                  href={`/questions/${properties.questionId}#${notif.answerId}`}
                >
                  menjawab pertanyaan Anda
                </Link>
                <Link
                  className='mt-2 block text-sm font-normal'
                  href={`/questions/${properties.questionId}#${notif.answerId}`}
                >
                  {notif.description}
                </Link>
              </div>

              {properties.hasBeenRead || (
                <button title='Tandai sudah dibaca'>
                  <CheckIcon />
                </button>
              )}
            </div>
          </>
        ))
        .with({ type: 'best-answer' }, (notif) => (
          <>
            <div className='flex items-center space-x-4'>
              <CheckCircle color='green' size={28} />
              <Link href={`/users/${properties.user.username}`}>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={properties.user.avatar.imageUrl} />
                  <AvatarFallback>
                    {properties.user.avatar.fallback}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
            <div className='ml-12 mt-2 flex items-end justify-between'>
              <div className='gap-4 text-sm font-medium'>
                <Link
                  className='hover:underline'
                  href={`/users/${properties.user.username}`}
                >
                  {properties.user.fullName}
                </Link>{' '}
                <Link
                  href={`/questions/${properties.questionId}#${notif.answerId}`}
                >
                  menjadikan jawaban Anda menjadi yang terbaik
                </Link>
                <Link
                  className='mt-2 block text-sm font-normal'
                  href={`/questions/${properties.questionId}#${notif.answerId}`}
                >
                  {notif.description}
                </Link>
              </div>

              {properties.hasBeenRead || (
                <button title='Tandai sudah dibaca'>
                  <CheckIcon />
                </button>
              )}
            </div>
          </>
        ))
        .otherwise(() => '')}
    </section>
  );
}
