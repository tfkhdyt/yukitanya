'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { P, match } from 'ts-pattern';

import { QuestionModal } from '@/components/modals/question-modal';
import { NotifCount } from '@/components/notif-counter';
import { Button } from '@/components/ui/button';
import { menu } from '@/constants/menu';
import { User } from '@/server/auth';

export function MobileNav({ user }: { user?: User }) {
	const pathname = usePathname();

	return (
		<div
			className={clsx(
				'md:hidden w-full fixed bottom-0 z-50 flex items-center border-t-2 bg-white/75 p-2 backdrop-blur-md text-[#696984]',
				user ? 'justify-between' : 'justify-around',
			)}
		>
			{menu.map((each) => {
				if (each.title === 'Notifikasi' && !user) return;
				if (each.title === 'Buat') {
					if (user) {
						return (
							<QuestionModal user={user} key={each.title}>
								<Button
									type='button'
									aria-label={each.title}
									className='rounded-xl'
								>
									<each.icon size={24} strokeWidth={2} />
								</Button>
							</QuestionModal>
						);
					}
					return;
				}

				if (each.title === 'Premium') return;
				if (each.title === 'Favorit') return;

				return (
					<Link
						className='flex w-fit items-center px-4 py-3 transition relative'
						href={each.url}
						key={each.title}
						aria-label={each.title}
					>
						{match(pathname)
							.with(P.string.startsWith(each.url), () => {
								return (
									<>
										<each.icon size={28} strokeWidth={2} />
										{each.url === '/notifications' && user && (
											<NotifCount userId={user.id} />
										)}
									</>
								);
							})
							.otherwise(() => (
								<>
									<each.icon size={28} strokeWidth={1} />
									{each.url === '/notifications' && user && (
										<NotifCount userId={user.id} />
									)}
								</>
							))}
					</Link>
				);
			})}
		</div>
	);
}
