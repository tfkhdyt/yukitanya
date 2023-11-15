import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/_components/ui/avatar';
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

type Props = {
  hasBeenRead: boolean;
  timestamp: Date;
  user: {
    avatar: {
      imageUrl: string;
      fallback: string;
    };
    fullName: string;
    username: string;
  };
  questionId: string;
} & (
  | {
      type: 'favorite';
    }
  | {
      type: 'best-answer' | 'new-answer';
      answer: string;
      answerId: string;
    }
  | {
      type: 'rating';
      rating: number;
      answerId: string;
    }
);

export function NotificationItem(props: Props) {
  return (
    <section
      className={clsx(
        'border-b-2 p-4 text-[#696984] transition',
        props.hasBeenRead
          ? 'hover:bg-slate-50'
          : 'bg-slate-50 hover:bg-slate-100',
      )}
    >
      {match(props)
        .with({ type: 'favorite' }, () => (
          <>
            <div className='flex items-center space-x-4'>
              <HeartIcon size={28} color='red' fill='red' />
              <Link href={`/users/${props.user.username}`}>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={props.user.avatar.imageUrl} />
                  <AvatarFallback>{props.user.avatar.fallback}</AvatarFallback>
                </Avatar>
              </Link>
            </div>
            <div className='ml-12 mt-2 flex items-center justify-between gap-4'>
              <span className='text-sm font-medium'>
                <Link
                  href={`/users/${props.user.username}`}
                  className='hover:underline'
                >
                  {props.user.fullName}
                </Link>{' '}
                <Link href={`/questions/${props.questionId}`}>
                  menyukai pertanyaan Anda
                </Link>
              </span>

              {props.hasBeenRead || (
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
              <StarIcon size={28} color='#F48C06' fill='#F48C06' />
              <Link href={`/users/${props.user.username}`}>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={props.user.avatar.imageUrl} />
                  <AvatarFallback>{props.user.avatar.fallback}</AvatarFallback>
                </Avatar>
              </Link>
            </div>
            <div className='ml-12 mt-2 flex items-center justify-between gap-4'>
              <span className='text-sm font-medium'>
                <Link
                  href={`/users/${props.user.username}`}
                  className='hover:underline'
                >
                  {props.user.fullName}
                </Link>{' '}
                <Link href={`/questions/${props.questionId}#${notif.answerId}`}>
                  memberi nilai terhadap jawaban Anda ({notif.rating})
                </Link>
              </span>

              {props.hasBeenRead || (
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
              <MessageCircleIcon size={28} color='#6364FF' />
              <Link href={`/users/${props.user.username}`}>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={props.user.avatar.imageUrl} />
                  <AvatarFallback>{props.user.avatar.fallback}</AvatarFallback>
                </Avatar>
              </Link>
            </div>
            <div className='ml-12 mt-2 flex items-end justify-between gap-4'>
              <div className='text-sm font-medium'>
                <Link
                  href={`/users/${props.user.username}`}
                  className='hover:underline'
                >
                  {props.user.fullName}
                </Link>{' '}
                <Link href={`/questions/${props.questionId}#${notif.answerId}`}>
                  menjawab pertanyaan Anda
                </Link>
                <Link
                  href={`/questions/${props.questionId}#${notif.answerId}`}
                  className='mt-2 block text-sm font-normal'
                >
                  {notif.answer}
                </Link>
              </div>

              {props.hasBeenRead || (
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
              <CheckCircle size={28} color='green' />
              <Link href={`/users/${props.user.username}`}>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={props.user.avatar.imageUrl} />
                  <AvatarFallback>{props.user.avatar.fallback}</AvatarFallback>
                </Avatar>
              </Link>
            </div>
            <div className='ml-12 mt-2 flex items-end justify-between'>
              <div className='gap-4 text-sm font-medium'>
                <Link
                  href={`/users/${props.user.username}`}
                  className='hover:underline'
                >
                  {props.user.fullName}
                </Link>{' '}
                <Link href={`/questions/${props.questionId}#${notif.answerId}`}>
                  menjadikan jawaban Anda menjadi yang terbaik
                </Link>
                <Link
                  href={`/questions/${props.questionId}#${notif.answerId}`}
                  className='mt-2 block text-sm font-normal'
                >
                  {notif.answer}
                </Link>
              </div>

              {props.hasBeenRead || (
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
