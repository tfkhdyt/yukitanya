'use client';

import { mapel } from '@/constants/mapel';
import { Session } from 'next-auth';
import Image from 'next/image';
import { useParams, usePathname } from 'next/navigation';
import { P, match } from 'ts-pattern';
import { TanyakanSekarangButton } from '../buttons/tanyakan-sekarang';
import { MostPopularQuestionSection } from './most-popular-question';

export function RightSidebar({ session }: { session: Session | null }) {
	const pathname = usePathname();
	const params = useParams();

	return (
		<aside className='sticky top-0 hidden h-screen w-1/4 space-y-4 border-l-2 p-6 text-2xl font-extrabold text-[#F48C06] lg:inline'>
			{match(pathname)
				.with(P.string.startsWith('/home'), () => (
					<div className='space-y-12'>
						<TanyakanSekarangSection session={session} />
						<MostPopularQuestionSection />
					</div>
				))
				.with(P.string.startsWith('/search'), () => (
					<div className='space-y-12'>
						<MostPopularQuestionSection />
					</div>
				))
				.with(P.string.startsWith('/notifications'), () => (
					<div className='space-y-12'>
						<MostPopularQuestionSection />
					</div>
				))
				.with(P.string.startsWith('/questions'), () => (
					<div className='space-y-12'>
						<MostPopularQuestionSection />
					</div>
				))
				.with(P.string.startsWith('/users'), () => (
					<div className='space-y-12'>
						<TanyakanSekarangSection session={session} />
						<MostPopularQuestionSection />
					</div>
				))
				.with(
					P.string.startsWith('/subjects/') && P.string.minLength(11),
					() => (
						<div className='space-y-12'>
							<TanyakanSekarangSection session={session} />
							<MostPopularQuestionSection
								subject={mapel.find((mpl) => mpl.id === params.id)}
							/>
						</div>
					),
				)
				.with(P.string.startsWith('/subjects'), () => '')
				.otherwise(() => '')}
		</aside>
	);
}

function TanyakanSekarangSection({ session }: { session: Session | null }) {
	return (
		<div className='space-y-4'>
			<h2 className='text-xl font-extrabold'>JANGAN MALU UNTUK BERTANYA!</h2>
			<Image
				alt='Mari bertanya'
				height={129}
				src='/img/home/mari-bertanya.png'
				width={168}
			/>
			{session && <TanyakanSekarangButton user={session?.user} />}
		</div>
	);
}
