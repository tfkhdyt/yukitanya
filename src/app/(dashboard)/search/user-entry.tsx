import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createInitial, getDiceBearAvatar } from '@/lib/utils';
import { type User } from '@/server/auth';

export function UserEntry({
  user,
}: {
  user: User & {
    createdAt: Date;
  };
}) {
  return (
    <Link href={`/users/${user.username}`}>
      <div className='flex items-center space-x-3 border-b-2 p-4 text-[#696984] transition hover:bg-slate-50'>
        <div>
          <Avatar>
            <AvatarImage src={user.image ?? getDiceBearAvatar(user.username)} />
            <AvatarFallback>{createInitial(user.name)}</AvatarFallback>
          </Avatar>
        </div>
        <div className='text-[#696984]'>
          <p
            className='line-clamp-1 font-medium decoration-2 hover:underline'
            title={user.name ?? user.username}
          >
            {user.name}
          </p>
          <p className='line-clamp-1 font-normal' title={`@${user.username}`}>
            @{user.username}
          </p>
        </div>
      </div>
    </Link>
  );
}
