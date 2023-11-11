import dayjs from 'dayjs';
import {
  FacebookIcon,
  Heart,
  LinkIcon,
  MessageCircle,
  MoreHorizontalIcon,
  PencilIcon,
  Share2Icon,
  TrashIcon,
  TwitterIcon,
} from 'lucide-react';
import Link from 'next/link';

import { StarRating } from '@/app/_components/star-rating';
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
import { AnswerModal } from '../../questions/[id]/answer/answer-modal';

export function QuestionPost({
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
    <div className='flex space-x-3 border-b-2 p-4 transition hover:bg-slate-50'>
      <Avatar>
        <AvatarImage src={user.avatar.imageUrl} />
        <AvatarFallback>{user.avatar.fallback}</AvatarFallback>
      </Avatar>
      <div className='grow space-y-1'>
        <div className='flex items-center space-x-2 text-[#696984]'>
          <Link
            href={`/users/${user.username}`}
            className='max-w-[6.25rem] cursor-pointer truncate font-medium decoration-2 hover:underline md:max-w-[12rem]'
            title={user.fullName}
          >
            {user.fullName}
          </Link>
          <Link
            href={`/users/${user.username}`}
            className='max-w-[6.25rem] truncate font-normal md:max-w-[12rem]'
            title={`@${user.username}`}
          >
            @{user.username}
          </Link>
          <Link
            href={`/questions/${post.id}`}
            className='font-light'
            title={dayjs(post.date).format('dddd, D MMMM YYYY HH:mm:ss')}
          >
            <span className='mr-2 text-sm font-medium'>·</span>
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
            <Link href={`/subjects/${post.subject.id}`}>
              <Badge variant='secondary' className='hover:bg-slate-200'>
                <button>{post.subject.title}</button>
              </Badge>
            </Link>
          </div>
          <StarRating rating={post.rating} />
        </div>
        <div className='flex flex-wrap gap-2 pt-2 text-[#696984]'>
          <Button
            size='sm'
            variant='outline'
            className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
            title='Favorit'
          >
            <Heart size={18} className='mr-1' />
            {post.numberOfFavorites}
          </Button>
          <AnswerModal user={user} post={post}>
            <Button
              size='sm'
              variant='outline'
              className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
              title='Beri jawaban mu'
            >
              <MessageCircle size={18} className='mr-1' />
              {post.numberOfAnswers}
            </Button>
          </AnswerModal>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size='sm'
                variant='outline'
                className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
                title='Bagikan'
              >
                <Share2Icon size={18} />
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
              <DropdownMenuItem>
                <LinkIcon size={18} className='mr-1' />
                <span>Salin link</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size='sm'
                variant='outline'
                className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
                title='Lainnya'
              >
                <MoreHorizontalIcon size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='text-[#696984]'>
              <DropdownMenuLabel>Menu lainnya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <PencilIcon size={18} className='mr-1' />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='focus:bg-red-100 focus:text-red-900'>
                <TrashIcon size={18} className='mr-1' />
                <span>Hapus</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
