'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { P, match } from 'ts-pattern';

import { type User } from '@/server/auth';
import { useSidebarStore } from '@/stores/sidebar';

import { menu } from '@/constants/menu';
import { api } from '@/trpc/react';
import { ProfileButton } from './profile-button';

export function Sidebar({
	isMobile = false,
	user,
}: {
	isMobile?: boolean;
	user: User | undefined;
}) {
	const pathname = usePathname();
	const toggleSidebar = useSidebarStore((state) => state.toggle);
	const notifCount = api.notification.getNotificationCount.useQuery(user?.id);

	return (
		<nav className='space-y-6 text-[#696984] md:p-3 lg:space-y-8 lg:p-6'>
			<div className='ml-4 flex items-end space-x-2'>
				<Image
					alt='Yukitanya Logo'
					className='h-10 w-auto'
					height={49}
					src='/img/yukitanya_logo.png'
					width={54}
				/>
				<span className='font-rubik text-xl font-extrabold text-black lg:text-2xl'>
					Yukitanya
				</span>
			</div>
			<div className='space-y-1 lg:space-y-2'>
				{menu.map((each) => {
					if (each.title === 'Notifikasi' && !user) return;

					return (
						<Link
							className='flex w-fit items-center space-x-6 rounded-full border-2 border-transparent px-4 py-3 transition hover:border-[#F48C06] relative'
							href={each.url}
							key={each.title}
							onClick={isMobile ? toggleSidebar : undefined}
						>
							{match(pathname)
								.with(P.string.startsWith(each.url), () => {
									return (
										<>
											<each.icon size={28} strokeWidth={2} />
											{each.url === '/notifications' &&
												notifCount.data &&
												notifCount.data > 0 && (
													<div className='absolute top-0 left-1.5 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-white bg-[#F48C06] rounded-full'>
														{notifCount.data}
													</div>
												)}
											<p className='text-xl font-medium'>{each.title}</p>
										</>
									);
								})
								.otherwise(() => (
									<>
										<each.icon size={28} strokeWidth={1} />
										{each.url === '/notifications' &&
											notifCount.data &&
											notifCount.data > 0 && (
												<div className='absolute top-0 left-1.5 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-white bg-[#F48C06] rounded-full'>
													{notifCount.data}
												</div>
											)}
										<p className='text-xl font-light'>{each.title}</p>
									</>
								))}
						</Link>
					);
				})}
				<div className='hidden lg:block'>
					<ProfileButton user={user} />
				</div>
			</div>
		</nav>
	);
}
