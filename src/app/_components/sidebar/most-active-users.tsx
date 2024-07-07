import { createInitial } from '@/lib/utils';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { AvatarWithBadge } from '../avatar-with-badge';
import { SkeletonMostActiveUsers } from './skeleton-most-active-users';

export function MostActiveUsers({
  setSheetOpen,
}: {
  setSheetOpen?: () => void;
}) {
  const { data, isLoading } = api.user.findMostActiveUsers.useQuery();

  if (isLoading) {
    return <SkeletonMostActiveUsers />;
  }

  if (data && data.length > 0)
    return (
      <div className='space-y-4'>
        <h2 className='text-xl font-extrabold uppercase text-[#F48C06]'>
          PENGGUNA TERAKTIF MUSIM INI
        </h2>

        <ol className='space-y-5'>
          {data.map(({ user, score }, index) => (
            <li key={user.id} className='flex space-x-2 items-center'>
              <div className='text-[#696984] w-4 pr-2 font-medium text-lg'>
                <span>{index + 1}.</span>
              </div>
              <Link
                href={`/users/${user.username}`}
                aria-label={user.username}
                onClick={setSheetOpen}
              >
                <AvatarWithBadge
                  user={{
                    ...user,
                    membership: user.membership,
                    initial: createInitial(user.name ?? undefined),
                  }}
                />
              </Link>
              <div className='text-[#696984] grow'>
                <Link
                  className='max-w-[10rem] cursor-pointer truncate font-medium decoration-2 hover:underline md:max-w-[12rem] block text-base'
                  href={`/users/${user.username}`}
                  onClick={setSheetOpen}
                  title={user.name ?? user.username}
                >
                  {user.name}
                </Link>
                <Link
                  className='max-w-[10rem] truncate font-normal md:max-w-[12rem] block text-base'
                  href={`/users/${user.username}`}
                  onClick={setSheetOpen}
                  title={`@${user.username}`}
                >
                  @{user.username}
                </Link>
              </div>
              <p
                className='ml-auto bg-orange-500 rounded-full text-white p-2 size-8 text-sm flex justify-center items-center font-medium'
                title='Score, dihitung berdasarkan jumlah pertanyaan, jawaban, dan favorit'
              >
                {score}
              </p>
            </li>
          ))}
        </ol>
      </div>
    );
}
