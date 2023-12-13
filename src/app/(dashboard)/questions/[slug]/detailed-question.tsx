'use client';

import { BotIcon, Heart, MessageCircle, Share2Icon } from 'lucide-react';
import { type Session } from 'next-auth';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { match } from 'ts-pattern';

import { AvatarWithBadge } from '@/components/avatar-with-badge';
import { ShareDropdown } from '@/components/dropdown/share-dropdown';
import { AnswerModal } from '@/components/modals/answer-modal';
import { badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { environment } from '@/environment.mjs';
import { formatLongDateTime } from '@/lib/datetime';
import { type User } from '@/server/auth';
import { api } from '@/trpc/react';
import clsx from 'clsx';
import Image from 'next/image';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { AskAIModal } from '@/components/modals/ask-ai-modal';

type Question = {
	content: string;
	createdAt: Date;
	id: string;
	subject: {
		id: string;
		name: string;
	};
	updatedAt: Date;
	owner: User;
	slug: string;
	images: {
		id: string;
		url: string;
	}[];
};

export function DetailedQuestion({
	question,
	session,
}: {
	question: Question;
	session: Session | null;
}) {
	const utils = api.useUtils();
	const favoriteMutation = api.favorite.toggleFavorite.useMutation({
		onError: () => toast.error('Gagal memberi favorit'),
		onSuccess: () => utils.question.invalidate(),
	});
	const questionMetadata = api.question.findQuestionMetadata.useQuery(
		question.id,
	);

	const handleFavorite = () => {
		if (session?.user) {
			favoriteMutation.mutate({
				questionId: question.id,
				userId: session.user.id,
			});
		}
	};

	return (
		<>
			<div className='border-b-2 p-4'>
				<div className='flex items-center space-x-3'>
					<Link
						href={`/users/${question.owner.username}`}
						aria-label={question.owner.username}
					>
						<AvatarWithBadge user={question.owner} classNames='h-12 w-12' />
					</Link>
					<div className='text-[#696984]'>
						<Link
							className='block max-w-[16rem] md:max-w-md cursor-pointer truncate font-medium decoration-2 hover:underline'
							href={`/users/${question.owner.username}`}
							title={question.owner.name ?? question.owner.username}
						>
							{question.owner.name}
						</Link>
						<Link
							className='block max-w-[16rem] md:max-w-md truncate font-normal'
							href={`/users/${question.owner.username}`}
							title={`@${question.owner.username}`}
						>
							@{question.owner.username}
						</Link>
					</div>
				</div>

				<div className='my-2'>
					<p className='whitespace-pre-wrap py-1 text-sm leading-relaxed text-[#696984]'>
						{question.content}
					</p>
				</div>

				{question.images.length > 0 && (
					<PhotoProvider>
						<div
							className={clsx(
								'grid gap-4 w-5/6 pt-2',
								question.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1',
							)}
						>
							{question.images.map((img, idx) => (
								<PhotoView key={img.id} src={img.url}>
									<Image
										src={img.url}
										alt={img.id}
										key={img.id}
										height={720}
										width={720}
										className={clsx(
											'object-cover',
											idx + 1 === 3 && question.images.length === 3
												? 'col-span-2 aspect-[2.7/1]'
												: 'aspect-[4/3]',
										)}
									/>
								</PhotoView>
							))}
						</div>
					</PhotoProvider>
				)}

				<div className='mt-4 flex flex-wrap-reverse items-center justify-between gap-4 md:flex-wrap'>
					<span className='flex flex-wrap items-center gap-1 text-sm font-medium text-[#696984]'>
						<p>{formatLongDateTime(question.createdAt)}</p>
						{question.createdAt.getTime() !== question.updatedAt.getTime() && (
							<span
								className='hover:underline'
								title={`Diedit pada ${formatLongDateTime(question.updatedAt)}`}
							>
								*
							</span>
						)}
						<p>·</p>
						{match(questionMetadata.isLoading)
							.with(false, () => (
								<>
									<p className='font-semibold'>
										{questionMetadata.data?.favorites.length} favorit
									</p>
									<p>·</p>
									<p className='font-semibold'>
										{questionMetadata.data?.answers.length} jawaban
									</p>
								</>
							))
							.otherwise(() => (
								<>
									<Skeleton className='h-5 w-14 rounded-md' />
									<p>·</p>
									<Skeleton className='h-5 w-14 rounded-md' />
								</>
							))}
					</span>
					<div className='space-x-1'>
						<Link
							href={`/subjects/${question.subject.id}`}
							className={clsx(
								badgeVariants({ variant: 'secondary' }),
								'hover:bg-gray-200',
							)}
						>
							{question.subject.name}
						</Link>
					</div>
				</div>
			</div>
			<div className='flex flex-wrap items-center justify-around md:justify-evenly border-b-2 py-2 text-[#696984] md:gap-2'>
				<Button
					className='space-x-2 rounded-full px-3 text-base hover:bg-slate-100 hover:text-[#696984]'
					size='sm'
					title='Favorit'
					variant='ghost'
					disabled={
						!session || favoriteMutation.isLoading || !session.user.membership
					}
					onClick={handleFavorite}
				>
					<>
						{questionMetadata.data?.favorites.some(
							(favorite) => favorite.userId === session?.user.id,
						) ? (
							<Heart className='mr-1' color='red' fill='red' size={18} />
						) : (
							<Heart className='mr-1' size={18} />
						)}
					</>
					<span className='hidden md:inline'>Favorit</span>
				</Button>
				{session ? (
					<AnswerModal question={question} session={session}>
						<Button
							className='space-x-2 rounded-full px-3 text-base hover:bg-slate-100 hover:text-[#696984]'
							size='sm'
							title='Jawab'
							variant='ghost'
						>
							<MessageCircle size={18} />
							<span className='hidden md:inline'>Jawab</span>
						</Button>
					</AnswerModal>
				) : (
					<Button
						className='space-x-2 rounded-full px-3 text-base hover:bg-slate-100 hover:text-[#696984]'
						size='sm'
						title='Jawab'
						variant='ghost'
						disabled
					>
						<MessageCircle size={18} />
						<span className='hidden md:inline'>Jawab</span>
					</Button>
				)}
				{session ? (
					<AskAIModal question={question} session={session}>
						<Button
							className='space-x-2 rounded-full px-3 text-base hover:bg-slate-100 hover:text-[#696984]'
							size='sm'
							title='Tanyakan pada AI'
							variant='ghost'
							disabled={session.user.membership?.type !== 'plus'}
						>
							<BotIcon size={18} />
							<span className='hidden md:inline'>Tanyakan pada AI</span>
						</Button>
					</AskAIModal>
				) : (
					<Button
						className='space-x-2 rounded-full px-3 text-base hover:bg-slate-100 hover:text-[#696984]'
						size='sm'
						title='Tanyakan pada AI'
						variant='ghost'
						disabled
					>
						<BotIcon size={18} />
						<span className='hidden md:inline'>Tanyakan pada AI</span>
					</Button>
				)}
				<ShareDropdown
					url={
						new URL(
							`/questions/${question.slug}`,
							environment.NEXT_PUBLIC_BASE_PATH,
						)
					}
				>
					<Button
						className='space-x-2 rounded-full px-3 text-base hover:bg-slate-100 hover:text-[#696984]'
						size='sm'
						title='Bagikan'
						variant='ghost'
					>
						<Share2Icon size={18} />
						<span className='hidden md:inline'>Bagikan</span>
					</Button>
				</ShareDropdown>
			</div>
		</>
	);
}
