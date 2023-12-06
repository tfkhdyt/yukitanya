'use client';

import clsx from 'clsx';
import { debounce } from 'lodash';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { formatLongDateTime } from '@/lib/datetime';
import { createInitial, getDiceBearAvatar } from '@/lib/utils';
import { api } from '@/trpc/react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
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

	const [clamped, setClamped] = useState(true);
	const [showButton, setShowButton] = useState(true);
	const containerReference = useRef<HTMLParagraphElement>(null);

	const handleReadMore = () => setClamped((v) => !v);

	useEffect(() => {
		const hasClamping = (element: HTMLParagraphElement) => {
			const { clientHeight, scrollHeight } = element;
			return clientHeight !== scrollHeight;
		};

		const checkButtonAvailability = () => {
			if (containerReference.current) {
				const hadClampClass =
					containerReference.current.classList.contains('line-clamp-4');
				if (!hadClampClass)
					containerReference.current.classList.add('line-clamp-4');
				setShowButton(hasClamping(containerReference.current));
				if (!hadClampClass)
					containerReference.current.classList.remove('line-clamp-4');
			}
		};

		const debouncedCheck = debounce(checkButtonAvailability, 50);

		checkButtonAvailability();
		window.addEventListener('resize', debouncedCheck);

		return () => {
			window.removeEventListener('resize', debouncedCheck);
		};
	});

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
							<Avatar>
								<AvatarImage
									src={
										data.owner.image ?? getDiceBearAvatar(data.owner.username)
									}
									alt={`${data.owner.name} avatar`}
								/>
								<AvatarFallback>
									{createInitial(data.owner.name)}
								</AvatarFallback>
							</Avatar>
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
								clamped && 'line-clamp-4',
							)}
							ref={containerReference}
						>
							{data.question.content}
						</p>
					</Link>
					{showButton && (
						<button
							className='text-sm font-medium text-[#696984] hover:underline mt-2'
							onClick={handleReadMore}
							type='button'
						>
							Tampilkan lebih {clamped ? 'banyak' : 'sedikit'}
						</button>
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
