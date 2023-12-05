import { Skeleton } from '../ui/skeleton';

export function SkeletonMostActiveUsers() {
	return (
		<div className='space-y-4'>
			<h2 className='text-xl font-extrabold uppercase text-[#F48C06]'>
				PENGGUNA TERAKTIF
			</h2>

			<ol className='space-y-5'>
				<li className='flex space-x-2 items-center'>
					<span className='mr-1 text-[#696984] font-medium w-4 text-lg'>
						1.
					</span>
					<Skeleton className='rounded-full h-10 w-10' />
					<div className='text-[#696984] space-y-1'>
						<Skeleton className='h-5 w-36 rounded-md' />
						<Skeleton className='h-5 w-28 rounded-md' />
					</div>
				</li>
				<li className='flex space-x-2 items-center'>
					<span className='mr-1 text-[#696984] font-medium w-4 text-lg'>
						2.
					</span>
					<Skeleton className='rounded-full h-10 w-10' />
					<div className='text-[#696984] space-y-1'>
						<Skeleton className='h-5 w-24 rounded-md' />
						<Skeleton className='h-5 w-20 rounded-md' />
					</div>
				</li>
				<li className='flex space-x-2 items-center'>
					<span className='mr-1 text-[#696984] font-medium w-4 text-lg'>
						3.
					</span>
					<Skeleton className='rounded-full h-10 w-10' />
					<div className='text-[#696984] space-y-1'>
						<Skeleton className='h-5 w-20 rounded-md' />
						<Skeleton className='h-5 w-16 rounded-md' />
					</div>
				</li>
			</ol>
		</div>
	);
}
