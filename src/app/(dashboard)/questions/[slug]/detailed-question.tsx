'use client';

import { Heart, MessageCircle, Share2Icon } from 'lucide-react';
import { type Session } from 'next-auth';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { match } from 'ts-pattern';

import { ShareDropdown } from '@/components/dropdown/share-dropdown';
import { AnswerModal } from '@/components/modals/answer-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { environment } from '@/environment.mjs';
import { formatLongDateTime } from '@/lib/datetime';
import { getDiceBearAvatar } from '@/lib/utils';
import { type User } from '@/server/auth';
import { api } from '@/trpc/react';

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
					<Avatar className='h-12 w-12'>
						<AvatarImage
							src={
								question.owner.image ??
								getDiceBearAvatar(question.owner.username)
							}
							alt={`${question.owner.name} avatar`}
						/>
						<AvatarFallback>{question.owner.initial}</AvatarFallback>
					</Avatar>
					<div className='text-[#696984]'>
						<Link
							className='block max-w-full cursor-pointer truncate font-medium decoration-2 hover:underline'
							href={`/users/${question.owner.username}`}
							title={question.owner.name ?? question.owner.username}
						>
							{question.owner.name}
						</Link>
						<Link
							className='block max-w-full truncate font-normal'
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
							className={badgeVariants({ variant: 'secondary' })}
						>
							{question.subject.name}
						</Link>
					</div>
				</div>
			</div>
			<div className='flex flex-wrap items-center justify-around border-b-2 py-2 text-[#696984] md:gap-2'>
				<Button
					className='space-x-2 rounded-full px-3 text-base hover:bg-slate-100 hover:text-[#696984]'
					size='sm'
					title='Favorit'
					variant='ghost'
					disabled={!session || favoriteMutation.isLoading}
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
					<span>Favorit</span>
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
							<span>Jawab</span>
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
						<span>Jawab</span>
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
						<span>Bagikan</span>
					</Button>
				</ShareDropdown>
			</div>
		</>
	);
}
