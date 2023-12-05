import { Skeleton } from '../ui/skeleton';

export function SkeletonMostPopularSubjects() {
	return (
		<div className='space-y-4'>
			<h2 className='text-xl font-extrabold uppercase text-[#F48C06]'>
				MATA PELAJARAN TERPOPULER
			</h2>

			<ol className='space-y-2'>
				<li className='flex space-x-1 items-center'>
					<span className='mr-2 text-[#696984] font-medium w-4 text-lg'>
						1.
					</span>
					<Skeleton className='rounded-full h-10 w-10' />
					<Skeleton className='h-5 w-28 rounded-md' />
				</li>
				<li className='flex space-x-1 items-center'>
					<span className='mr-2 text-[#696984] font-medium w-4 text-lg'>
						2.
					</span>
					<Skeleton className='rounded-full h-10 w-10' />
					<Skeleton className='h-5 w-28 rounded-md' />
				</li>
				<li className='flex space-x-1 items-center'>
					<span className='mr-2 text-[#696984] font-medium w-4 text-lg'>
						3.
					</span>
					<Skeleton className='rounded-full h-10 w-10' />
					<Skeleton className='h-5 w-28 rounded-md' />
				</li>
			</ol>
		</div>
	);
}
