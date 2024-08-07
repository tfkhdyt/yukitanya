import dayjs from 'dayjs';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { formatLongDateTime } from '@/lib/datetime';
import { createInitial, getDiceBearAvatar } from '@/lib/utils';
import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';

import { AvatarWithBadge } from '@/components/avatar-with-badge';
import { z } from 'zod';
import { UserStat } from './user-stat';
import { UserTabs } from './user-tabs';

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const { username } = params;
  const user = await api.user.findUserByUsername.query(username);

  if (user) {
    return {
      title: `${user.name} (@${user.username}) - Yukitanya`,
      description: `Bergabung sejak ${formatLongDateTime(user.createdAt)}`,
      openGraph: {
        title: `${user.name} (@${user.username}) - Yukitanya`,
        description: `Bergabung sejak ${formatLongDateTime(user.createdAt)}`,
        images: [
          {
            url: user.image ?? getDiceBearAvatar(user.username),
            width: 600,
            height: 600,
          },
        ],
      },
    };
  }

  return {};
}

const tabScheme = z
  .enum(['Pertanyaan', 'Jawaban', 'Favorit'])
  .default('Pertanyaan');

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

  const activeTab = tabScheme.safeParse(searchParams?.tab);
  const membership = user.memberships.find((membership) =>
    dayjs().isBefore(membership.expiresAt),
  );

  return (
    <main>
      <div className='mx-4 mt-4 flex space-x-6 text-[#696984] md:m-8 md:space-x-8'>
        <AvatarWithBadge
          user={{
            ...user,
            membership,
            initial: createInitial(user.name ?? undefined),
          }}
          classNames='h-20 w-20 md:h-28 md:w-28'
          badgeSize='xl'
        />
        <div className='w-full space-y-2 text-[#696984]'>
          <p className='line-clamp-1 hidden font-medium md:block md:text-lg'>
            {user.name}
          </p>
          <UserStat username={user.username} />
          <span className='hidden text-sm md:block md:text-base'>
            Bergabung sejak{' '}
            <span title={formatLongDateTime(user.createdAt)}>
              {dayjs(user.createdAt).format('D MMMM YYYY')}
            </span>
          </span>
        </div>
      </div>
      <div className='m-4 mb-6 space-y-1 text-[#696984] md:hidden'>
        <p className='line-clamp-1 font-medium md:text-lg'>{user.name}</p>
        <span className='text-sm'>
          Bergabung sejak{' '}
          <span title={formatLongDateTime(user.createdAt)}>
            {dayjs(user.createdAt).format('D MMMM YYYY')}
          </span>
        </span>
      </div>
      <div className='w-full'>
        <UserTabs
          session={session ?? undefined}
          user={{
            id: user.id,
            name: user.name ?? user.username,
            username: user.username,
          }}
          activeTab={activeTab.success ? activeTab.data : 'Pertanyaan'}
        />
      </div>
    </main>
  );
}
