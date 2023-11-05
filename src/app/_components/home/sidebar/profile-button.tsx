import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

export function ProfileButton(props: {
  avatar: {
    imageUrl: string;
    fallback: string;
  };
  fullName: string;
  username: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex w-fit items-center space-x-3 rounded-full border-2 border-transparent px-4 py-3 transition hover:border-[#F48C06]'>
        <Avatar>
          <AvatarImage src={props.avatar.imageUrl} />
          <AvatarFallback>{props.avatar.fallback}</AvatarFallback>
        </Avatar>
        <div className='pr-2 text-left lg:pr-4'>
          <h2 className='text-sm font-semibold lg:text-base'>
            {props.fullName}
          </h2>
          <p className='hidden text-sm lg:inline lg:text-base'>
            @{props.username}
          </p>
        </div>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='font-poppins text-[#696984]'>
        <DropdownMenuLabel>@{props.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/users/${props.username}`}>
          <DropdownMenuItem className='cursor-pointer'>
            My Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
