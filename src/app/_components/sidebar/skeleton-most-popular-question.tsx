'use client';

import { Skeleton } from '../ui/skeleton';

export function SkeletonMostPopularQuestionSection({
  subject,
}: {
  subject?: {
    id?: string;
    name?: string;
  };
}) {
  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-extrabold uppercase text-[#F48C06]'>
        PERTANYAAN {subject?.name} TERPOPULER MINGGU INI
      </h2>

      <div className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <Skeleton className='rounded-full h-10 w-10' />
          <div className='text-[#696984] space-y-1'>
            <Skeleton className='h-5 w-24 rounded-md' />
            <Skeleton className='h-5 w-12 rounded-md' />
          </div>
        </div>
        <div className='space-y-1'>
          <Skeleton className='h-6 w-full rounded-md' />
          <Skeleton className='h-6 w-full rounded-md' />
          <Skeleton className='h-6 w-1/2 rounded-md' />
        </div>

        <div className='flex items-center gap-2 pt-2 flex-wrap-reverse justify-between'>
          <div className='text-sm font-medium text-[#696984] flex flex-wrap gap-1'>
            <Skeleton className='h-5 w-44' />
            <span>·</span>
            <Skeleton className='h-5 w-16' />
            <span>·</span>
            <Skeleton className='h-5 w-16' />
          </div>
          <Skeleton className='h-5 w-12 rounded-full' />
        </div>
      </div>
    </div>
  );
}
