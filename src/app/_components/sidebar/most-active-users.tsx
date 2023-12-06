import { createInitial, getDiceBearAvatar } from '@/lib/utils';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
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
					PENGGUNA TERAKTIF
				</h2>

				<ol className='space-y-5'>
					{data.map(({ user }, index) => (
						<li key={user.id} className='flex space-x-2 items-center'>
							<span className='mr-1 text-[#696984] font-medium w-4 text-lg'>
								{index + 1}.
							</span>
							<Link
								href={`/users/${user.username}`}
								aria-label={user.username}
								onClick={setSheetOpen}
							>
								<Avatar>
									<AvatarImage
										src={user.image ?? getDiceBearAvatar(user.username)}
										alt={`${user.name} avatar`}
									/>
									<AvatarFallback>{createInitial(user.name)}</AvatarFallback>
								</Avatar>
							</Link>
							<div className='text-[#696984]'>
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
						</li>
					))}
				</ol>
			</div>
		);
}
