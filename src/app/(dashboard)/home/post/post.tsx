import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Heart, Link, MessageCircle } from 'lucide-react';
import NextLink from 'next/link';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/_components/ui/avatar';
import { Badge } from '@/app/_components/ui/badge';
import { Button } from '@/app/_components/ui/button';

import { StarRating } from './star-rating';

dayjs.extend(relativeTime);

export function Post({
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
      title: string;
    };
    rating: number;
    numberOfAnswers: number;
    numberOfFavorites: number;
  };
}) {
  return (
    <div className='flex space-x-3 border-b-2 p-6'>
      <Avatar>
        <AvatarImage src={user.avatar.imageUrl} />
        <AvatarFallback>{user.avatar.fallback}</AvatarFallback>
      </Avatar>
      <div className='space-y-1'>
        <div className='flex items-center space-x-2 text-[#696984]'>
          <p
            className='max-w-[6.25rem] truncate font-semibold md:max-w-[12rem]'
            title={user.fullName}
          >
            {user.fullName}
          </p>
          <p
            className='max-w-[6.25rem] truncate font-light md:max-w-[12rem]'
            title={user.username}
          >
            @{user.username}
          </p>
          <span
            className='font-light'
            title={dayjs(post.date).format('dddd, D MMMM YYYY HH:mm:ss')}
          >
            <span className='mr-2'>•</span>
            <span className='md:hidden'>{dayjs(post.date).fromNow(true)}</span>
            <span className='hidden md:inline'>
              {dayjs(post.date).fromNow()}
            </span>
          </span>
        </div>
        <p className='py-1 text-sm leading-relaxed text-[#696984]'>
          {post.content}
        </p>
        <div className='flex justify-between pt-2'>
          <div className='mr-2 space-x-1'>
            <NextLink href={`/subjects/${post.subject.id}`}>
              <Badge variant='secondary' className='hover:bg-slate-200'>
                <button>{post.subject.title}</button>
              </Badge>
            </NextLink>
          </div>
          <StarRating rating={4.3} />
        </div>
        <div className='flex flex-wrap gap-2 pt-2 text-[#696984]'>
          <NextLink
            href={`/questions/${post.id}`}
            title={`Lihat Jawaban (${post.numberOfAnswers})`}
          >
            <Button
              size='sm'
              variant='outline'
              className='rounded-full text-sm'
            >
              <MessageCircle size={18} className='mr-1' />
              {post.numberOfAnswers}
            </Button>
          </NextLink>
          <Button
            size='sm'
            variant='outline'
            className='rounded-full text-sm'
            title={`Favorit (${post.numberOfAnswers})`}
          >
            <Heart size={18} className='mr-1' />
            {post.numberOfFavorites}
          </Button>
          <Button
            size='sm'
            variant='outline'
            className='rounded-full text-sm'
            title='Salin link'
          >
            <Link size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
