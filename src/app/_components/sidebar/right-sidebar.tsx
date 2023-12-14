'use client';

import { useParams, usePathname } from 'next/navigation';
import { P, match } from 'ts-pattern';

import { mapel } from '@/constants/mapel';

import { MostActiveUsers } from './most-active-users';
import { MostPopularQuestionSection } from './most-popular-question';
import { MostPopularSubject } from './most-popular-subject';

type Props = {
	setSheetOpen?: () => void;
};

export function RightSidebar({ setSheetOpen }: Props) {
	const pathname = usePathname();
	const params = useParams();

	return (
		<div className='space-y-4'>
			{match(pathname)
				.with(
					P.string.startsWith('/subjects/') && P.string.minLength(11),
					() => (
						<div className='space-y-8'>
							<MostPopularQuestionSection
								subject={mapel.find((mpl) => mpl.id === params.id)}
								setSheetOpen={setSheetOpen}
							/>
							<MostActiveUsers setSheetOpen={setSheetOpen} />
						</div>
					),
				)
				.with(P.string.startsWith('/subjects'), () => (
					<div className='space-y-8'>
						<MostPopularSubject setSheetOpen={setSheetOpen} />
						<MostPopularQuestionSection setSheetOpen={setSheetOpen} />
						<MostActiveUsers setSheetOpen={setSheetOpen} />
					</div>
				))
				.otherwise(() => (
					<div className='space-y-8'>
						<MostPopularQuestionSection setSheetOpen={setSheetOpen} />
						<MostActiveUsers setSheetOpen={setSheetOpen} />
					</div>
				))}
		</div>
	);
}
