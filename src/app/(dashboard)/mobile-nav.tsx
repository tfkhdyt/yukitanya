import { menu } from '@/constants/menu';
import { User } from '@/server/auth';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { P, match } from 'ts-pattern';

export function MobileNav({ user }: { user?: User }) {
	const pathname = usePathname();
	const notifCount = api.notification.getNotificationCount.useQuery(user?.id);

	return (
		<div className='md:hidden w-full fixed bottom-0 z-50 flex items-center justify-between border-t-2 bg-white/75 py-2 px-4 backdrop-blur-md text-[#696984]'>
			{menu.map((each) => {
				if (each.title === 'Notifikasi' && !user) return;

				return (
					<Link
						className='flex w-fit items-center px-4 py-3 transition relative'
						href={each.url}
						key={each.title}
						// onClick={isMobile ? toggleSidebar : undefined}
					>
						{match(pathname)
							.with(P.string.startsWith(each.url), () => {
								return (
									<>
										<each.icon size={28} strokeWidth={2} />
										{each.url === '/notifications' &&
											notifCount.data &&
											notifCount.data > 0 && (
												<div className='absolute top-0 left-7 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-white bg-[#F48C06] rounded-full'>
													{notifCount.data}
												</div>
											)}
									</>
								);
							})
							.otherwise(() => (
								<>
									<each.icon size={28} strokeWidth={1} />
									{each.url === '/notifications' &&
										notifCount.data &&
										notifCount.data > 0 && (
											<div className='absolute top-0 left-7 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-white bg-[#F48C06] rounded-full'>
												{notifCount.data}
											</div>
										)}
								</>
							))}
					</Link>
				);
			})}
		</div>
	);
}
