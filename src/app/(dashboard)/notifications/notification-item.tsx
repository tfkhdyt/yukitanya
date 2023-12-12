import clsx from 'clsx';
import {
	CheckCircleIcon,
	CheckIcon,
	HeartIcon,
	MessageCircleIcon,
	StarIcon,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { match } from 'ts-pattern';

import { AvatarWithBadge } from '@/components/avatar-with-badge';
import { formatLongDateTime, getFromNowTime } from '@/lib/datetime';
import { type User } from '@/server/auth';
import { api } from '@/trpc/react';

type Question = {
	slug: string;
	content: string;
};

type Properties = {
	id: string;
	type: 'rating' | 'best-answer' | 'new-answer' | 'favorite';
	transmitterUser: User;
	rating?: number | null;
	question: Question;
	createdAt: Date;
	hasBeenRead: boolean;
	description: string;
};

export function NotificationItem({
	id,
	type,
	transmitterUser,
	rating,
	question,
	createdAt,
	hasBeenRead,
	description,
}: Properties) {
	const utils = api.useUtils();
	const markHasBeenReadMutation = api.notification.markHasBeenRead.useMutation({
		onError: () => toast.error('Gagal menandai notifikasi'),
		onSuccess: () => utils.notification.invalidate(),
	});

	const handleRead = () => {
		markHasBeenReadMutation.mutate(id);
	};

	return (
		<section
			className={clsx(
				'border-b-2 p-4 text-[#696984] transition',
				hasBeenRead ? 'hover:bg-slate-50' : 'bg-slate-50 hover:bg-slate-100',
			)}
		>
			<div className='flex items-center space-x-4'>
				{match(type)
					.with('favorite', () => (
						<HeartIcon color='red' fill='red' size={28} />
					))
					.with('best-answer', () => (
						<CheckCircleIcon color='green' size={28} />
					))
					.with('new-answer', () => (
						<MessageCircleIcon color='#6364FF' size={28} />
					))
					.with('rating', () => (
						<StarIcon color='#F48C06' fill='#F48C06' size={28} />
					))
					.exhaustive()}

				<Link
					href={`/users/${transmitterUser.username}`}
					aria-label={transmitterUser.username}
				>
					<AvatarWithBadge user={transmitterUser} classNames='h-10 w-10' />
				</Link>
			</div>
			<div className='ml-12 mt-2 flex items-center justify-between gap-4'>
				<span className='text-sm font-medium'>
					<Link
						className='hover:underline'
						href={`/users/${transmitterUser.username}`}
					>
						{transmitterUser.name}
					</Link>{' '}
					<Link href={`/questions/${question.slug}`} onClick={handleRead}>
						{match(type)
							.with('favorite', () => 'menyukai pertanyaan Anda')
							.with(
								'best-answer',
								() => 'menjadikan jawaban Anda menjadi yang terbaik',
							)
							.with('new-answer', () => 'menjawab pertanyaan Anda')
							.with(
								'rating',
								() => `memberi ${rating} bintang terhadap jawaban Anda`,
							)
							.exhaustive()}
					</Link>
					<Link
						className='font-light'
						href={`/questions/${question.slug}`}
						onClick={handleRead}
					>
						<span className='mx-2 text-sm font-medium'>·</span>
						<span
							className='hover:underline'
							title={formatLongDateTime(createdAt)}
						>
							{getFromNowTime(createdAt)}
						</span>
					</Link>
					<Link
						className='mt-2 line-clamp-1 whitespace-pre-wrap text-sm font-normal'
						href={`/questions/${question.slug}`}
						onClick={handleRead}
					>
						{description}
					</Link>
				</span>

				{hasBeenRead || (
					<button
						title='Tandai sudah dibaca'
						onClick={handleRead}
						type='button'
					>
						<CheckIcon />
					</button>
				)}
			</div>
		</section>
	);
}
