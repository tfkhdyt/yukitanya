'use client';

import clsx from 'clsx';
import {
	BotIcon,
	Heart,
	MessageCircle,
	MoreHorizontalIcon,
	PencilIcon,
	Share2Icon,
	TrashIcon,
} from 'lucide-react';
import { type Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import ReactShowMoreText from 'react-show-more-text';

import { AnswerModal } from '@/components/modals/answer-modal';
import { DeleteModal } from '@/components/modals/delete-modal';
import { EditQuestionModal } from '@/components/modals/edit-question-modal';
import { StarRating } from '@/components/star-rating';
import { badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { environment } from '@/environment.mjs';
import { formatLongDateTime, getFromNowTime } from '@/lib/datetime';
import { containsURL } from '@/lib/utils';
import { type User } from '@/server/auth';
import { api } from '@/trpc/react';

import { AvatarWithBadge } from '../avatar-with-badge';
import { ShareDropdown } from '../dropdown/share-dropdown';
import { AskAIModal } from '../modals/ask-ai-modal';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

type Question = {
	content: string;
	createdAt: Date;
	id: string;
	isFavorited?: boolean;
	numberOfAnswers: number;
	numberOfFavorites: number;
	rating?: number;
	subject: {
		id: string;
		name: string;
	};
	updatedAt: Date;
	slug: string;
	owner: User;
	images: {
		id: string;
		url: string;
	}[];
};

export function QuestionPost({
	highlightedWords,
	question,
	session,
}: {
	highlightedWords?: string[];
	question: Question;
	session: Session | null;
}) {
	const utils = api.useUtils();
	const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
	const [isShowDropdown, setIsShowDropDown] = useState(false);

	const favoriteMutation = api.favorite.toggleFavorite.useMutation({
		onError: () => toast.error('Gagal memberi favorit'),
		onSuccess: async () => {
			await Promise.allSettled([
				utils.question.invalidate(),
				utils.favorite.findAllFavoritedQuestions.invalidate(),
				utils.user.invalidate(),
			]);
		},
	});

	const deleteQuestionMutation = api.question.deleteQuestionById.useMutation({
		onError: () => {
			toast.dismiss();
			toast.error('Gagal menghapus pertanyaan');
		},
		onSuccess: async () => {
			toast.dismiss();
			toast.success('Pertanyaan telah dihapus!');

			await Promise.allSettled([
				utils.question.invalidate(),
				utils.favorite.findAllFavoritedQuestions.invalidate(),
				utils.user.invalidate(),
			]);
		},
	});

	const handleFavorite = () => {
		if (session?.user) {
			favoriteMutation.mutate({
				questionId: question.id,
				userId: session.user.id,
			});
		}
	};

	const handleDeleteQuestion = (id: string) => {
		setIsShowDeleteModal(false);
		toast.loading('Pertanyaan akan segera dihapus...');
		deleteQuestionMutation.mutate(id);
	};

	return (
		<div className='flex space-x-3 border-b-2 p-4 transition hover:bg-slate-50'>
			<Link
				href={`/users/${question.owner.username}`}
				aria-label={question.owner.username}
				className='h-fit'
			>
				<AvatarWithBadge user={question.owner} />
			</Link>
			<div className='grow space-y-1'>
				<div className='flex items-center space-x-2 text-[#696984] max-w-full'>
					<Link
						className='cursor-pointer font-medium decoration-2 hover:underline break-all line-clamp-1 max-w-[38%] md:max-w-[50%]'
						href={`/users/${question.owner.username}`}
						title={question.owner.name ?? question.owner.username}
					>
						{question.owner.name}
					</Link>
					<Link
						className='font-normal break-all line-clamp-1 max-w-[23%] md:max-w-[34%]'
						href={`/users/${question.owner.username}`}
						title={`@${question.owner.username}`}
					>
						@{question.owner.username}
					</Link>
					<Link className='font-light' href={`/questions/${question.slug}`}>
						<span className='mr-2 text-sm font-medium'>·</span>
						<span
							className='hover:underline'
							title={formatLongDateTime(question.createdAt)}
						>
							{getFromNowTime(question.createdAt)}
						</span>
						{question.createdAt.getTime() !== question.updatedAt.getTime() && (
							<span
								className='ml-1 hover:underline'
								title={`Diedit pada ${formatLongDateTime(question.updatedAt)}`}
							>
								*
							</span>
						)}
					</Link>
				</div>
				<Link href={`/questions/${question.slug}`}>
					<ReactShowMoreText
						more='Tampilkan lebih banyak'
						less='Tampilkan lebih sedikit'
						anchorClass='text-sm font-medium text-[#696984] hover:underline -ml-1 cursor-pointer'
						className={clsx(
							'whitespace-pre-wrap py-1 text-sm leading-relaxed text-[#696984]',
							containsURL(question.content) ? 'break-all' : 'break-words',
						)}
						truncatedEndingComponent='...  '
					>
						{question.content.split(' ').map((word, index) => {
							if (highlightedWords?.includes(word.toLowerCase())) {
								return (
									<span key={`${word}-${index}`}>
										<span className='bg-[#F48C06] px-1 font-medium text-white'>
											{word}
										</span>{' '}
									</span>
								);
							}
							return <span key={`${word}-${index}`}>{word} </span>;
						})}
					</ReactShowMoreText>
				</Link>
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
				<div className='flex justify-between pt-4'>
					<div className='mr-2 space-x-1'>
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
					{question.rating && (
						<div className='flex items-center gap-1'>
							<span className='text-[#696984]'>
								({question.rating.toFixed(1)})
							</span>
							<StarRating rating={question.rating} />
						</div>
					)}
				</div>
				<div className='flex flex-wrap gap-2 pt-2 text-[#696984]'>
					{session?.user.membership ? (
						<Button
							className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
							disabled={favoriteMutation.isLoading}
							onClick={handleFavorite}
							size='sm'
							title='Favorit'
							variant='ghost'
						>
							<>
								{question.isFavorited ? (
									<Heart className='mr-1' color='red' fill='red' size={18} />
								) : (
									<Heart className='mr-1' size={18} />
								)}
								{question.numberOfFavorites}
							</>
						</Button>
					) : (
						<Popover>
							<PopoverTrigger asChild>
								<Button
									className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
									size='sm'
									title='Favorit'
									variant='ghost'
								>
									<>
										{question.isFavorited ? (
											<Heart
												className='mr-1'
												color='red'
												fill='red'
												size={18}
											/>
										) : (
											<Heart className='mr-1' size={18} />
										)}
										{question.numberOfFavorites}
									</>
								</Button>
							</PopoverTrigger>
							<PopoverContent className='text-[#696984] font-medium rounded-xl'>
								Anda harus menjadi pengguna{' '}
								<Link href='/premium' className='font-bold hover:underline'>
									Premium
								</Link>{' '}
								untuk menggunakan fitur ini.
							</PopoverContent>
						</Popover>
					)}

					{session ? (
						<AnswerModal question={question} session={session}>
							<Button
								className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
								size='sm'
								title='Beri jawaban mu'
								variant='ghost'
							>
								<MessageCircle className='mr-1' size={18} />
								{question.numberOfAnswers}
							</Button>
						</AnswerModal>
					) : (
						<Popover>
							<PopoverTrigger asChild>
								<Button
									className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
									size='sm'
									title='Beri jawaban mu'
									variant='ghost'
								>
									<MessageCircle className='mr-1' size={18} />
									{question.numberOfAnswers}
								</Button>
							</PopoverTrigger>
							<PopoverContent className='text-[#696984] font-medium rounded-xl'>
								Anda harus{' '}
								<Link
									href='/auth/sign-in'
									className='font-bold hover:underline'
								>
									Sign In
								</Link>{' '}
								untuk menggunakan fitur ini.
							</PopoverContent>
						</Popover>
					)}

					{session?.user.membership?.type === 'plus' ? (
						<AskAIModal question={question} session={session}>
							<Button
								className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
								size='sm'
								title='Tanyakan pada AI'
								variant='ghost'
							>
								<BotIcon className='mr-1' size={18} />
							</Button>
						</AskAIModal>
					) : (
						<Popover>
							<PopoverTrigger asChild>
								<Button
									className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
									size='sm'
									title='Tanyakan pada AI'
									variant='ghost'
								>
									<BotIcon className='mr-1' size={18} />
								</Button>
							</PopoverTrigger>
							<PopoverContent className='text-[#696984] font-medium rounded-xl'>
								Anda harus menjadi pengguna{' '}
								<Link href='/premium' className='font-bold hover:underline'>
									Premium+
								</Link>{' '}
								untuk menggunakan fitur ini.
							</PopoverContent>
						</Popover>
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
							className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
							size='sm'
							title='Bagikan'
							variant='ghost'
						>
							<Share2Icon size={18} />
						</Button>
					</ShareDropdown>
					{session?.user.id === question.owner.id && (
						<DropdownMenu
							onOpenChange={setIsShowDropDown}
							open={isShowDropdown}
						>
							<DropdownMenuTrigger
								asChild
								onPointerDown={(e) => e.preventDefault()}
								onClick={() => setIsShowDropDown((v) => !v)}
							>
								<Button
									className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
									size='sm'
									title='Lainnya'
									variant='ghost'
								>
									<MoreHorizontalIcon size={18} />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className='text-[#696984]'>
								<DropdownMenuLabel>Menu lainnya</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<EditQuestionModal question={question} user={session.user}>
									<DropdownMenuItem
										className='cursor-pointer'
										onSelect={(event) => event.preventDefault()}
									>
										<PencilIcon className='mr-2' size={18} />
										<span>Edit</span>
									</DropdownMenuItem>
								</EditQuestionModal>

								<DeleteModal
									description='Apakah Anda yakin ingin menghapus pertanyaan ini?'
									onClick={() => handleDeleteQuestion(question.id)}
									onOpenChange={setIsShowDeleteModal}
									open={isShowDeleteModal}
									title='Hapus pertanyaan'
								>
									<DropdownMenuItem
										className='cursor-pointer focus:bg-red-100 focus:text-red-900'
										onSelect={(event) => event.preventDefault()}
									>
										<TrashIcon className='mr-2' size={18} />
										<span>Hapus</span>
									</DropdownMenuItem>
								</DeleteModal>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</div>
	);
}
