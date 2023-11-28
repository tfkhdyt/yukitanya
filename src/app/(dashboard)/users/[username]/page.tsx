import dayjs from 'dayjs';
import { redirect } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatLongDateTime } from '@/lib/datetime';
import { createInitial, getDiceBearAvatar } from '@/lib/utils';
import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';

import { UserStat } from './user-stat';
import { UserTabs } from './user-tabs';

export default async function UserPage({
  params,
  searchParams,
}: {
  params: { username: string };
  searchParams?: { tab: string };
}) {
  const session = await getServerAuthSession();
  const user = await api.user.findUserByUsername.query(params.username);
  if (!user) return redirect('/home');

  let activeTab = searchParams?.tab ?? 'Pertanyaan';
  activeTab = ['Pertanyaan', 'Jawaban', 'Favorit'].includes(activeTab)
    ? activeTab
    : 'Pertanyaan';

  return (
    <main className=''>
      <div className='m-8 mb-8 flex space-x-8 text-[#696984]'>
        <Avatar className='h-36 w-36'>
          <AvatarImage src={user.image ?? getDiceBearAvatar(user.username)} />
          <AvatarFallback>{createInitial(user.name)}</AvatarFallback>
        </Avatar>
        <div className='space-y-2'>
          <div className='flex flex-wrap space-x-2 text-lg'>
            <p className='font-semibold'>{user.name}</p>
            <p>·</p>
            <p className='font-light'>@{user.username}</p>
          </div>
          <UserStat username={user.username} />
          <p>
            Bergabung sejak{' '}
            <span title={formatLongDateTime(user.createdAt)}>
              {dayjs(user.createdAt).format('D MMM YYYY')}
            </span>
          </p>
        </div>
      </div>
      <div className='w-full'>
        <UserTabs
          session={session}
          user={{
            id: user.id,
            name: user.name ?? user.username,
            username: user.username,
          }}
          activeTab={activeTab}
        />
      </div>
    </main>
  );
}
