import { getDiceBearAvatar } from '@/lib/utils';
import { User } from '@/server/auth';

import clsx from 'clsx';
import { BadgeCheckIcon } from 'lucide-react';
import { match } from 'ts-pattern';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function AvatarWithBadge({
	user,
	classNames,
	badgeSize = 'sm',
}: { user: User; classNames?: string; badgeSize?: 'sm' | 'lg' | 'xl' }) {
	return (
		<div className='relative w-fit h-fit'>
			<Avatar className={clsx(classNames)}>
				<AvatarImage
					src={user.image ?? getDiceBearAvatar(user.username)}
					alt={`${user.name} avatar`}
				/>
				<AvatarFallback>{user.initial}</AvatarFallback>
			</Avatar>
			{match(user.membership?.type)
				.with('standard', () => (
					<div className='absolute -bottom-1 -right-1' title='Premium'>
						<BadgeCheckIcon
							color='white'
							fill='#1D9BF0'
							size={match(badgeSize)
								.with('sm', () => 20)
								.with('lg', () => 24)
								.with('xl', () => 32)
								.exhaustive()}
							strokeWidth={1.5}
						/>
					</div>
				))
				.with('plus', () => (
					<div className='absolute -bottom-1 -right-1' title='Premium+'>
						<BadgeCheckIcon
							color='#15202B'
							fill='#FFD400'
							size={match(badgeSize)
								.with('sm', () => 20)
								.with('lg', () => 24)
								.with('xl', () => 32)
								.exhaustive()}
							strokeWidth={1.5}
						/>
					</div>
				))
				.otherwise(() => undefined)}
		</div>
	);
}
