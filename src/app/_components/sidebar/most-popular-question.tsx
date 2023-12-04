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

export function MostPopularQuestionSection({
	subject,
}: {
	subject?: {
		id?: string;
		name?: string;
	};
}) {
	const { data } = api.question.findMostPopularQuestion.useQuery(subject?.id);

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

	if (data && data.popularity > 0) {
		return (
			<div className='space-y-4'>
				<h2 className='text-xl font-extrabold uppercase text-[#F48C06]'>
					PERTANYAAN {subject?.name} TERPOPULER
				</h2>

				<div>
					<div className='flex items-center space-x-2'>
						<Avatar>
							<AvatarImage
								src={data.owner.image ?? getDiceBearAvatar(data.owner.username)}
								alt={`${data.owner.name} avatar`}
							/>
							<AvatarFallback>{createInitial(data.owner.name)}</AvatarFallback>
						</Avatar>
						<div className='text-[#696984]'>
							<Link
								className='max-w-full cursor-pointer truncate font-medium decoration-2 hover:underline md:max-w-[12rem] block text-base'
								href={`/users/${data.owner.username}`}
								title={data.owner.name ?? data.owner.username}
							>
								{data.owner.name}
							</Link>
							<Link
								className='max-w-full truncate font-normal md:max-w-[12rem] block text-base'
								href={`/users/${data.owner.username}`}
								title={`@${data.owner.username}`}
							>
								@{data.owner.username}
							</Link>
						</div>
					</div>
					<div className='mt-2'>
						<p
							className={clsx(
								'whitespace-pre-wrap pt-1 text-sm leading-relaxed text-[#696984] font-normal',
								clamped && 'line-clamp-4',
							)}
							ref={containerReference}
						>
							{data.question.content}
						</p>
					</div>
					{showButton && (
						<button
							className='text-sm font-medium text-[#696984] hover:underline'
							onClick={handleReadMore}
							type='button'
						>
							Tampilkan lebih {clamped ? 'banyak' : 'sedikit'}
						</button>
					)}
					<div className='flex items-center gap-2 py-4 flex-wrap-reverse justify-between'>
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
