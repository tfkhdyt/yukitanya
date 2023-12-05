'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/trpc/react';

export function UserStat({ username }: { username: string }) {
	const stat = api.user.findUserStatByUsername.useQuery(username);

	return (
		<ol className='flex w-full justify-around gap-4 text-sm md:justify-normal md:gap-8 md:text-base'>
			{stat.isLoading || !stat.data ? (
				<>
					<li className='md:flex md:items-center md:space-x-2'>
						<span className='flex justify-center text-lg font-semibold md:inline md:justify-normal'>
							<Skeleton className='h-7 w-5' />
						</span>
						<span>pertanyaan</span>
					</li>
					<li className='md:flex md:items-center md:space-x-2'>
						<span className='flex justify-center text-lg font-semibold md:inline md:justify-normal'>
							<Skeleton className='h-7 w-5' />
						</span>
						<span>jawaban</span>
					</li>
					<li className='md:flex md:items-center md:space-x-2'>
						<span className='flex justify-center text-lg font-semibold md:inline md:justify-normal'>
							<Skeleton className='h-7 w-5' />
						</span>
						<span>favorit</span>
					</li>
				</>
			) : (
				<>
					<li className='md:flex md:items-center md:space-x-1'>
						<span className='flex justify-center text-lg font-semibold md:inline md:justify-normal md:text-base'>
							{stat.data.questions.length}
						</span>
						<span>pertanyaan</span>
					</li>
					<li className='md:flex md:items-center md:space-x-1'>
						<span className='flex justify-center text-lg font-semibold md:inline md:justify-normal md:text-base'>
							{stat.data.answers.length}
						</span>
						<span>jawaban</span>
					</li>
					<li className='md:flex md:items-center md:space-x-1'>
						<span className='flex justify-center text-lg font-semibold md:inline md:justify-normal md:text-base'>
							{stat.data.favorites.length}
						</span>
						<span>favorit</span>
					</li>
				</>
			)}
		</ol>
	);
}
