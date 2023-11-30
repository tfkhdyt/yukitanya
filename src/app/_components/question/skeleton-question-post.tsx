import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonQuestionPost() {
	return (
		<div className='flex space-x-3 border-b-2 p-4'>
			<Skeleton className='h-10 w-10 rounded-full' />
			<div className='grow space-y-1'>
				<div className='flex items-center space-x-2 text-[#696984]'>
					<Skeleton className='h-6 w-24 rounded-md' />
					<Skeleton className='h-6 w-12 rounded-md' />
					<Skeleton className='h-6 w-12 rounded-md' />
				</div>
				<Skeleton className='h-6 w-full rounded-md' />
				<Skeleton className='h-6 w-full rounded-md' />
				<Skeleton className='h-6 w-24 rounded-md' />

				<div className='flex justify-between pt-2'>
					<div className='mr-2 space-x-1'>
						<Skeleton className='h-5 w-12 rounded-full' />
					</div>
				</div>
				<div className='flex flex-wrap gap-2 pt-2 text-[#696984]'>
					<Skeleton className='h-9 w-9 rounded-full' />
					<Skeleton className='h-9 w-9 rounded-full' />
					<Skeleton className='h-9 w-9 rounded-full' />
				</div>
			</div>
		</div>
	);
}
