'use client';

import clsx from 'clsx';
import Link from 'next/link';

import { useClamp } from '@/hooks/useClamp';
import { formatLongDateTime } from '@/lib/datetime';
import { createInitial } from '@/lib/utils';
import { api } from '@/trpc/react';
import Image from 'next/image';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { AvatarWithBadge } from '../avatar-with-badge';
import { badgeVariants } from '../ui/badge';
import { SkeletonMostPopularQuestionSection } from './skeleton-most-popular-question';

export function MostPopularQuestionSection({
	subject,
	setSheetOpen,
}: {
	subject?: {
		id?: string;
		name?: string;
	};
	setSheetOpen?: () => void;
}) {
	const { data, isLoading } = api.question.findMostPopularQuestion.useQuery(
		subject?.id,
	);

	const { isOpen, setIsOpen, ref, showReadMoreButton } = useClamp();

	if (isLoading) {
		return <SkeletonMostPopularQuestionSection subject={subject} />;
	}

	if (data && data.popularity > 0) {
		return (
			<div className='space-y-4'>
				<h2 className='text-xl font-extrabold uppercase text-[#F48C06]'>
					PERTANYAAN {subject?.name} TERPOPULER
				</h2>

				<div>
					<div className='flex items-center space-x-2'>
						<Link
							href={`/users/${data.owner.username}`}
							aria-label={data.owner.username}
							onClick={setSheetOpen}
						>
							<AvatarWithBadge
								user={{
									...data.owner,
									membership: data.owner.membership[0],
									initial: createInitial(data.owner.name),
								}}
							/>
						</Link>
						<div className='text-[#696984]'>
							<Link
								className='max-w-[10rem] cursor-pointer truncate font-medium decoration-2 hover:underline md:max-w-[12rem] block text-base'
								href={`/users/${data.owner.username}`}
								onClick={setSheetOpen}
								title={data.owner.name ?? data.owner.username}
							>
								{data.owner.name}
							</Link>
							<Link
								className='max-w-[10rem] truncate font-normal md:max-w-[12rem] block text-base'
								href={`/users/${data.owner.username}`}
								onClick={setSheetOpen}
								title={`@${data.owner.username}`}
							>
								@{data.owner.username}
							</Link>
						</div>
					</div>
					<Link
						href={`/questions/${data.question.slug}`}
						onClick={setSheetOpen}
					>
						<p
							className={clsx(
								'whitespace-pre-wrap pt-2 text-sm leading-relaxed text-[#696984] font-normal',
								isOpen || 'line-clamp-4',
							)}
							ref={ref}
						>
							{data.question.content}
						</p>
					</Link>
					{showReadMoreButton && (
						<button
							className='text-sm font-medium text-[#696984] hover:underline mt-2'
							onClick={() => setIsOpen((v) => !v)}
							type='button'
							tabIndex={-1}
						>
							Tampilkan lebih {isOpen ? 'sedikit' : 'banyak'}
						</button>
					)}
					{data.images.length > 0 && (
						<PhotoProvider>
							<div
								className={clsx(
									'grid gap-2 w-5/6 pt-2',
									data.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1',
								)}
							>
								{data.images.map((img, idx) => (
									<PhotoView key={img.id} src={img.url}>
										<Image
											src={img.url}
											alt={img.id}
											key={img.id}
											height={360}
											width={360}
											className={clsx(
												'object-cover',
												idx + 1 === 3 && data.images.length === 3
													? 'col-span-2 aspect-[2.7/1]'
													: 'aspect-[4/3]',
											)}
										/>
									</PhotoView>
								))}
							</div>
						</PhotoProvider>
					)}
					<div className='flex items-center gap-2 pt-4 flex-wrap-reverse justify-between'>
						<div className='text-sm font-medium text-[#696984] flex flex-wrap gap-1'>
							{formatLongDateTime(data.question.createdAt)}
							{data.question.createdAt.getTime() !==
								data.question.updatedAt.getTime() && (
								<span
									className='hover:underline'
									title={`Diedit pada ${formatLongDateTime(
										data.question.updatedAt,
									)}`}
								>
									*
								</span>
							)}
							<p>·</p>
							<p className='font-semibold'>{data.numberOfFavorites} favorit</p>
							<p>·</p>
							<p className='font-semibold'>{data.numberOfAnswers} jawaban</p>
						</div>
						<Link
							href={`/subjects/${data.subject.id}`}
							onClick={setSheetOpen}
							className={clsx(
								badgeVariants({ variant: 'secondary' }),
								'hover:bg-gray-200',
							)}
						>
							{data.subject.name}
						</Link>
					</div>
				</div>
			</div>
		);
	}
}
