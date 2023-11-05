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
          <p className='font-semibold'>{user.fullName}</p>
          <p className='font-light'>@{user.username}</p>
          <p>•</p>
          <p
            className='text-sm'
            title={dayjs(post.date).format('dddd, D MMMM YYYY HH:mm:ss')}
          >
            {dayjs(post.date).fromNow()}
          </p>
        </div>
        <p className='py-1 text-sm leading-relaxed text-[#696984]'>
          {post.content}
        </p>
        <div className='flex justify-between pt-2'>
          <div className='space-x-1'>
            <NextLink href={`/subjects/${post.subject.id}`}>
              <Badge variant='secondary' className='hover:bg-slate-200'>
                <button>{post.subject.title}</button>
              </Badge>
            </NextLink>
          </div>
          <StarRating rating={4.3} />
        </div>
        <div className='space-x-2 pt-2 text-[#696984]'>
          <NextLink href={`/questions/${post.id}`}>
            <Button
              size='sm'
              variant='outline'
              className='rounded-full text-sm'
            >
              <MessageCircle size={18} className='mr-2' />
              Lihat jawaban ({post.numberOfAnswers})
            </Button>
          </NextLink>
          <Button size='sm' variant='outline' className='rounded-full text-sm'>
            <Heart size={18} className='mr-2' />
            Favorit ({post.numberOfFavorites})
          </Button>
          <Button size='sm' variant='outline' className='rounded-full text-sm'>
            <Link size={18} className='mr-2' />
            Salin link
          </Button>
        </div>
      </div>
    </div>
  );
}
