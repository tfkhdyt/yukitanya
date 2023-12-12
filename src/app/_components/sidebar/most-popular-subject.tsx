import { mapel } from '@/constants/mapel';
import { api } from '@/trpc/react';
import Image from 'next/image';
import Link from 'next/link';
import { SkeletonMostPopularSubjects } from './skeleton-most-popular-subject';

export function MostPopularSubject({
	setSheetOpen,
}: {
	isMobile?: boolean;
	setSheetOpen?: () => void;
}) {
	const { data, isLoading } = api.subject.findMostPopularSubjects.useQuery();

	if (isLoading) {
		return <SkeletonMostPopularSubjects />;
	}

	if (data && data.length > 0)
		return (
			<div className='space-y-4'>
				<h2 className='text-xl font-extrabold uppercase text-[#F48C06]'>
					MATA PELAJARAN TERPOPULER
				</h2>

				<ol className='space-y-2'>
					{data.map((subject, index) => (
						<li key={subject.id} className='flex space-x-1 items-center'>
							<span className='pr-2 text-[#696984] font-medium w-4 text-lg'>
								{index + 1}.
							</span>
							<Link href={`/subjects/${subject.id}`} onClick={setSheetOpen}>
								<Image
									src={
										mapel.find((mpl) => mpl.id === subject.id)?.imageUrl ?? ''
									}
									height={40}
									width={40}
									alt={subject.name}
								/>
							</Link>
							<div className='text-[#696984]'>
								<Link
									className='max-w-[10rem] cursor-pointer truncate font-medium decoration-2 hover:underline md:max-w-[12rem] block text-base'
									href={`/subjects/${subject.id}`}
									onClick={setSheetOpen}
								>
									{subject.name}
								</Link>
							</div>
						</li>
					))}
				</ol>
			</div>
		);
}
