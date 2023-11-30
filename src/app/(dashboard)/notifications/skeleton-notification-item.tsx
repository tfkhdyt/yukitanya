import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonNotificationItem() {
  return (
    <section className='border-b-2 p-4 text-[#696984] transition'>
      <div className='flex items-center space-x-4'>
        <Skeleton className='h-7 w-7 rounded-full' />

        <Skeleton className='h-10 w-10 rounded-full' />
      </div>
      <div className='ml-12 mt-2 flex items-center justify-between gap-4'>
        <span className='text-sm font-medium'>
          <div className='flex space-x-1'>
            <Skeleton className='h-5 w-12' />
            <Skeleton className='h-5 w-52' />
            <Skeleton className='h-5 w-4' />
          </div>
          <Skeleton className='mt-2 h-5 w-1/2 ' />
        </span>
      </div>
    </section>
  );
}
