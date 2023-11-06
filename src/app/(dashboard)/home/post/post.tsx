import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Heart, LinkIcon, MessageCircle } from 'lucide-react';
import { default as Link, default as NextLink } from 'next/link';

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
    <div className='flex space-x-3 border-b-2 p-6 transition hover:bg-slate-50'>
      <Avatar>
        <AvatarImage src={user.avatar.imageUrl} />
        <AvatarFallback>{user.avatar.fallback}</AvatarFallback>
      </Avatar>
      <div className='space-y-1'>
        <div className='flex items-center space-x-2 text-[#696984]'>
          <Link
            href={`/users/${user.username}`}
            className='max-w-[6.25rem] cursor-pointer truncate font-semibold decoration-2 hover:underline md:max-w-[12rem]'
            title={user.fullName}
          >
            {user.fullName}
          </Link>
          <Link
            href={`/users/${user.username}`}
            className='max-w-[6.25rem] truncate font-light md:max-w-[12rem]'
            title={`@${user.username}`}
          >
            @{user.username}
          </Link>
          <Link
            href={`/questions/${post.id}`}
            className='font-light'
            title={dayjs(post.date).format('dddd, D MMMM YYYY HH:mm:ss')}
          >
            <span className='mr-2'>•</span>
            <span className='hover:underline md:hidden'>
              {dayjs(post.date).fromNow(true)}
            </span>
            <span className='hidden hover:underline md:inline'>
              {dayjs(post.date).fromNow()}
            </span>
          </Link>
        </div>
        <Link href={`/questions/${post.id}`}>
          <p className='py-1 text-sm leading-relaxed text-[#696984]'>
            {post.content}
          </p>
        </Link>
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
          <Button
            size='sm'
            variant='outline'
            className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
          >
            <MessageCircle size={18} className='mr-1' />
            {post.numberOfAnswers}
          </Button>
          <Button
            size='sm'
            variant='outline'
            className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
          >
            <Heart size={18} className='mr-1' />
            {post.numberOfFavorites}
          </Button>
          <Button
            size='sm'
            variant='outline'
            className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
          >
            <LinkIcon size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
