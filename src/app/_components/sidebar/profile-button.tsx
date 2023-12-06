import { LogOutIcon, MoreHorizontal, UserCircle } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getDiceBearAvatar } from '@/lib/utils';
import { type User } from '@/server/auth';

export function ProfileButton({ user }: { user: User | undefined }) {
	if (!user) {
		return (
			<div className='space-x-3 py-2 md:py-0 md:mt-6 md:px-4'>
				<Link
					className='rounded-lg bg-[#F48C06] px-3 py-1 font-semibold text-white shadow-md md:px-4 md:py-2'
					href='/auth/sign-in'
				>
					Masuk
				</Link>
				<Link
					className='rounded-lg bg-[#77425A] px-3 py-1 font-semibold text-white shadow-md md:px-4 md:py-2'
					href='/auth/sign-up'
				>
					Daftar
				</Link>
			</div>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='flex w-fit items-center space-x-3 rounded-full border-transparent transition md:border-2 md:px-4 md:py-3 md:hover:border-[#F48C06]'>
				<Avatar>
					<AvatarImage
						src={user?.image ?? getDiceBearAvatar(user.username)}
						alt={`${user.name} avatar`}
					/>
					<AvatarFallback>{user?.initial}</AvatarFallback>
				</Avatar>
				<div className='hidden text-left md:inline'>
					<h2 className='text-sm font-medium md:text-base truncate max-w-[5.5rem]'>
						{user?.name}
					</h2>
					<p className='hidden text-sm md:inline md:text-base truncate max-w-[5.5rem]'>
						@{user?.username}
					</p>
				</div>
				<div className='hidden md:inline-block pl-4'>
					<MoreHorizontal />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='text-[#696984]'>
				<DropdownMenuLabel className='max-w-[12rem] truncate'>
					@{user?.username}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<Link href={`/users/${user?.username}`}>
					<DropdownMenuItem className='cursor-pointer'>
						<UserCircle className='mr-2' size={18} />
						Profil
					</DropdownMenuItem>
				</Link>
				<DropdownMenuItem
					className='cursor-pointer focus:bg-red-100 focus:text-red-900'
					onClick={() =>
						signOut({
							callbackUrl: '/auth/sign-in',
						})
					}
				>
					<LogOutIcon className='mr-2' size={18} />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
