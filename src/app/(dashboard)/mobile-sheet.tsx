import { LogOutIcon, UserCircleIcon } from 'lucide-react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

import { RightSidebar } from '@/components/sidebar/right-sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { getDiceBearAvatar } from '@/lib/utils';

export function MobileSheet({ session }: { session: Session | null }) {
	const [open, setOpen] = useState(false);

	if (!session) {
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

	const closeSheet = () => {
		setOpen(false);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Avatar>
					<AvatarImage
						src={session.user.image ?? getDiceBearAvatar(session.user.username)}
						alt={`${session.user.name} avatar`}
					/>
					<AvatarFallback>{session.user.initial}</AvatarFallback>
				</Avatar>
			</SheetTrigger>
			<SheetContent className='text-[#696984] overflow-y-auto'>
				<div className='w-fit space-y-3'>
					<Avatar className='h-16 w-16'>
						<AvatarImage
							src={
								session.user?.image ?? getDiceBearAvatar(session.user.username)
							}
							alt={`${session.user.name} avatar`}
						/>
						<AvatarFallback>{session.user?.initial}</AvatarFallback>
					</Avatar>
					<div className='text-left'>
						<h2 className='font-medium truncate max-w-[10rem]'>
							{session.user?.name}
						</h2>
						<p className='truncate max-w-[10rem]'>@{session.user?.username}</p>
					</div>
				</div>
				<div className='mt-4 space-y-3'>
					<Link
						className='flex w-fit items-center space-x-6'
						href={`/users/${session.user?.username}`}
						onClick={() => setOpen(false)}
						tabIndex={-1}
					>
						<UserCircleIcon className='mr-2' size={28} strokeWidth={1} />
						Profil
					</Link>
					<button
						type='button'
						className='flex w-fit items-center space-x-6'
						onClick={() =>
							signOut({
								callbackUrl: '/auth/sign-in',
							})
						}
						tabIndex={-1}
					>
						<LogOutIcon className='mr-2' size={28} strokeWidth={1} />
						Sign out
					</button>
				</div>
				<div className='mt-6 pt-6 border-t-2'>
					<RightSidebar setSheetOpen={closeSheet} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
