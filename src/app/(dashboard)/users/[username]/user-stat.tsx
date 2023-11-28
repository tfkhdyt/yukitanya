'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/trpc/react';

export function UserStat({ username }: { username: string }) {
  const stat = api.user.findUserStatByUsername.useQuery(username);

  return (
    <ol className='flex space-x-8'>
      {stat.isLoading || !stat.data ? (
        <>
          <li className='flex items-center space-x-1'>
            <Skeleton className='h-6 w-4' /> <span>pertanyaan</span>
          </li>
          <li className='flex items-center space-x-1'>
            <Skeleton className='h-6 w-4' /> <span>jawaban</span>
          </li>
          <li className='flex items-center space-x-1'>
            <Skeleton className='h-6 w-4' /> <span>favorit</span>
          </li>
        </>
      ) : (
        <>
          <li>
            <span className='font-semibold'>{stat.data.questions.length}</span>{' '}
            pertanyaan
          </li>
          <li>
            <span className='font-semibold'>{stat.data.answers.length}</span>{' '}
            jawaban
          </li>
          <li>
            <span className='font-semibold'>{stat.data.favorites.length}</span>{' '}
            favorit
          </li>
        </>
      )}
    </ol>
  );
}
