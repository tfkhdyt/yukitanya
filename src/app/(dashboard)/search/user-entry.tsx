import Link from 'next/link';

import { type User } from '@/server/auth';
import { AvatarWithBadge } from '@/components/avatar-with-badge';

export function UserEntry({
	user,
}: {
	user: User;
}) {
	return (
		<Link href={`/users/${user.username}`}>
			<div className='flex items-center space-x-3 border-b-2 p-4 text-[#696984] transition hover:bg-slate-50'>
				<div>
					<AvatarWithBadge user={user} />
				</div>
				<div className='text-[#696984]'>
					<p
						className='line-clamp-1 font-medium decoration-2 hover:underline'
						title={user.name ?? user.username}
					>
						{user.name}
					</p>
					<p className='line-clamp-1 font-normal' title={`@${user.username}`}>
						@{user.username}
					</p>
				</div>
			</div>
		</Link>
	);
}
