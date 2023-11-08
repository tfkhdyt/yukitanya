import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { default as Link, default as NextLink } from 'next/link';

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
import {
  FacebookIcon,
  Heart,
  LinkIcon,
  MessageCircle,
  Share2Icon,
  TwitterIcon,
} from 'lucide-react';

dayjs.extend(relativeTime);

export function DetailedQuestion({
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
    <>
      <div className='border-b-2 p-4'>
        <div className='flex items-center space-x-3'>
          <Avatar className='h-12 w-12'>
            <AvatarImage src={user.avatar.imageUrl} />
            <AvatarFallback>{user.avatar.fallback}</AvatarFallback>
          </Avatar>
          <div className='text-[#696984]'>
            <Link
              href={`/users/${user.username}`}
              className='block max-w-full cursor-pointer truncate font-medium decoration-2 hover:underline'
              title={user.fullName}
            >
              {user.fullName}
            </Link>
            <Link
              href={`/users/${user.username}`}
              className='block max-w-full truncate font-normal'
              title={`@${user.username}`}
            >
              @{user.username}
            </Link>
          </div>
        </div>

        <div className='my-2'>
          <p className='py-1 text-sm leading-relaxed text-[#696984]'>
            {post.content}
          </p>
        </div>

        <div className='mt-4 flex flex-wrap-reverse items-center justify-between gap-4 md:flex-wrap'>
          <span className='flex flex-wrap items-center gap-1 text-sm font-medium text-[#696984]'>
            <p>{dayjs(post.date).format('dddd, D MMMM YYYY, HH:mm')}</p>
            <p>·</p>
            <p className='font-semibold'>{post.numberOfAnswers} jawaban</p>
            <p>·</p>
            <p className='font-semibold'>{post.numberOfFavorites} favorit</p>
          </span>
          <div className='space-x-1'>
            <NextLink href={`/subjects/${post.subject.id}`}>
              <Badge variant='secondary' className='hover:bg-slate-200'>
                <button>{post.subject.title}</button>
              </Badge>
            </NextLink>
          </div>
        </div>
      </div>
      <div className='flex flex-wrap items-center justify-evenly gap-2 border-b-2 py-2 text-[#696984]'>
        <Button
          size='sm'
          variant='ghost'
          className='space-x-2 rounded-full text-base hover:bg-slate-100 hover:text-[#696984]'
          title={`Favorit (${post.numberOfAnswers})`}
        >
          <Heart size={18} />
          <span>Favorit</span>
        </Button>
        <NextLink
          href={`/questions/${post.id}`}
          title={`Lihat Jawaban (${post.numberOfAnswers})`}
        >
          <Button
            size='sm'
            variant='ghost'
            className='space-x-2 rounded-full text-base hover:bg-slate-100 hover:text-[#696984]'
          >
            <MessageCircle size={18} />
            <span>Jawab</span>
          </Button>
        </NextLink>
        <Button
          size='sm'
          variant='ghost'
          className='space-x-2 rounded-full text-base hover:bg-slate-100 hover:text-[#696984]'
          title='Salin link'
        >
          <LinkIcon size={18} />
          <span>Salin link</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size='sm'
              variant='ghost'
              className='space-x-2 rounded-full text-base hover:bg-slate-100 hover:text-[#696984]'
              title='Bagikan'
            >
              <Share2Icon size={18} />
              <span>Bagikan</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='text-[#696984]'>
            <DropdownMenuLabel>Bagikan ke...</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <FacebookIcon size={18} className='mr-1' />
              <span>Facebook</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TwitterIcon size={18} className='mr-1' />
              <span>Twitter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
