import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonUserEntry() {
	return (
		<div>
			<div className='flex items-center space-x-3 border-b-2 p-4 text-[#696984] transition hover:bg-slate-50'>
				<div>
					<Skeleton className='h-10 w-10 rounded-full' />
				</div>
				<div className='space-y-2 text-[#696984]'>
					<Skeleton className='h-4 w-28 rounded-md' />
					<Skeleton className='h-4 w-14 rounded-md' />
				</div>
			</div>
		</div>
	);
}
