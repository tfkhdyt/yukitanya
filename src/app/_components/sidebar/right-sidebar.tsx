'use client';

import { mapel } from '@/constants/mapel';
import { Session } from 'next-auth';
import Image from 'next/image';
import { useParams, usePathname } from 'next/navigation';
import { P, match } from 'ts-pattern';
import { TanyakanSekarangButton } from '../buttons/tanyakan-sekarang';
import { MostActiveUsers } from './most-active-users';
import { MostPopularQuestionSection } from './most-popular-question';
import { MostPopularSubject } from './most-popular-subject';

type Props = {
	session: Session | null;
	isMobile?: boolean;
	setSheetOpen?: () => void;
};

export function RightSidebar({
	session,
	isMobile = false,
	setSheetOpen,
}: Props) {
	const pathname = usePathname();
	const params = useParams();

	return (
		<div className='space-y-4'>
			{match(pathname)
				.with(P.string.startsWith('/home'), () => (
					<div className='space-y-8'>
						{!isMobile && <TanyakanSekarangSection session={session} />}
						<MostPopularQuestionSection setSheetOpen={setSheetOpen} />
					</div>
				))
				.with(P.string.startsWith('/search'), () => (
					<div className='space-y-8'>
						<MostPopularQuestionSection setSheetOpen={setSheetOpen} />
						<MostActiveUsers setSheetOpen={setSheetOpen} />
					</div>
				))
				.with(P.string.startsWith('/notifications'), () => (
					<div className='space-y-8'>
						<MostPopularQuestionSection setSheetOpen={setSheetOpen} />
						<MostActiveUsers setSheetOpen={setSheetOpen} />
					</div>
				))
				.with(P.string.startsWith('/questions'), () => (
					<div className='space-y-8'>
						<MostPopularQuestionSection setSheetOpen={setSheetOpen} />
						<MostActiveUsers setSheetOpen={setSheetOpen} />
					</div>
				))
				.with(P.string.startsWith('/users'), () => (
					<div className='space-y-8'>
						{!isMobile && <TanyakanSekarangSection session={session} />}
						<MostActiveUsers setSheetOpen={setSheetOpen} />
					</div>
				))
				.with(
					P.string.startsWith('/subjects/') && P.string.minLength(11),
					() => (
						<div className='space-y-8'>
							{!isMobile && <TanyakanSekarangSection session={session} />}
							<MostPopularQuestionSection
								subject={mapel.find((mpl) => mpl.id === params.id)}
							/>
						</div>
					),
				)
				.with(P.string.startsWith('/subjects'), () => (
					<div className='space-y-8'>
						<MostPopularSubject setSheetOpen={setSheetOpen} />
						<MostPopularQuestionSection setSheetOpen={setSheetOpen} />
					</div>
				))
				.otherwise(() => '')}
		</div>
	);
}

function TanyakanSekarangSection({
	session,
	hidden = false,
}: { session: Session | null; hidden?: boolean }) {
	if (!hidden)
		return (
			<div className='space-y-4'>
				<h2 className='font-extrabold text-xl text-[#F48C06]'>
					JANGAN MALU UNTUK BERTANYA!
				</h2>
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
