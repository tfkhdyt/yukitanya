'use client';

import clsx from 'clsx';
import {
	CheckCircle,
	MoreHorizontalIcon,
	PencilIcon,
	Star,
	StarIcon,
	TrashIcon,
} from 'lucide-react';
import { type Session } from 'next-auth';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { DeleteModal } from '@/components/modals/delete-modal';
import { EditAnswerModal } from '@/components/modals/edit-answer-modal';
import { StarRating } from '@/components/star-rating';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useClamp } from '@/hooks/useClamp';
import { formatLongDateTime, getFromNowTime } from '@/lib/datetime';
import { type User } from '@/server/auth';
import { api } from '@/trpc/react';
import { AvatarWithBadge } from '../avatar-with-badge';

type Answer = {
	content: string;
	createdAt: Date;
	updatedAt: Date;
	id: string;
	isBestAnswer: boolean;
	numberOfVotes: number;
	ratings: {
		userId: string;
		value: number;
	}[];
	owner: User;
};

type Question = {
	content: string;
	createdAt: Date;
	updatedAt: Date;
	id: string;
	subject: {
		id: string;
		name: string;
	};
	owner: User;
	slug: string;
};

export function AnswerPost({
	answer,
	question,
	session,
}: {
	answer: Answer;
	question: Question;
	session: Session | null;
}) {
	const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
	const { isOpen, setIsOpen, showReadMoreButton, ref } = useClamp();

	const utils = api.useUtils();
	const deleteAnswerMutation = api.answer.deleteAnswerById.useMutation({
		onError: () => {
			toast.dismiss();
			toast.error('Gagal menghapus jawaban');
		},
		onSuccess: async () => {
			toast.dismiss();
			toast.success('Jawaban telah dihapus!');

			await Promise.allSettled([
				utils.answer.invalidate(),
				utils.question.findQuestionMetadata.invalidate(),
				utils.user.invalidate(),
			]);
		},
	});
	const [isShowDropdown, setIsShowDropDown] = useState(false);
	const [isShowRatingDropdown, setIsShowRatingDropdown] = useState(false);

	const handleDelete = (id: string) => {
		setIsShowDeleteModal(false);
		toast.loading('Jawaban akan segera dihapus...');
		deleteAnswerMutation.mutate(id);
	};

	const ratingMutation = api.rating.addRating.useMutation({
		onError: () => toast.error('Gagal menambahkan nilai'),
		onSuccess: async () => {
			toast.success('Berhasil memberi nilai!');
			await utils.answer.invalidate();
		},
	});

	const ratingFromMe = answer.ratings.find(
		(rating) => rating.userId === session?.user.id,
	)?.value;

	const handleRating = (rating: number) => {
		if (session?.user && ratingFromMe !== rating) {
			ratingMutation.mutate({
				answerId: answer.id,
				userId: session.user.id,
				value: rating,
			});
		}
		setIsShowRatingDropdown(false);
	};

	const averageRating =
		answer.ratings.length > 0
			? answer.ratings.reduce(
					(accumulator, rating) => accumulator + rating.value,
					0,
			  ) / answer.ratings.length
			: 0;

	const bestAnswerMutation = api.answer.toggleBestAnswer.useMutation({
		onError: () => toast.error('Gagal menandai jawaban terbaik'),
		onSuccess: () => utils.answer.invalidate(),
	});

	const handleBestAnswer = (id: string) => {
		if (session?.user.id) {
			bestAnswerMutation.mutate({
				answerId: id,
				questionId: question.id,
				userId: session.user.id,
			});
		}
	};

	const deleteRatingMutation = api.rating.deleteRating.useMutation({
		onError: () => toast.error('Gagal menghapus nilai'),
		onSuccess: async () => {
			toast.success('Berhasil menghapus nilai!');
			await utils.answer.invalidate();
			await utils.user.findUserStatByUsername.invalidate();
		},
	});

	const handleDeleteRating = (answerId: string) => {
		if (session?.user) {
			deleteRatingMutation.mutate({
				answerId,
				userId: session.user.id,
			});
			setIsShowRatingDropdown(false);
		}
	};

	return (
		<section id={answer.id} className='transition hover:bg-slate-50'>
			{answer.isBestAnswer && (
				<div className='px-4 pt-4'>
					<Alert className='border-green-600 bg-green-50'>
						<CheckCircle className='h-4 w-4' color='#16A34A' />
						<AlertTitle className='text-green-600'>Jawaban Terbaik!</AlertTitle>
						<AlertDescription className='text-green-800'>
							Pemilik pertanyaan menandai jawaban ini sebagai jawaban terbaik.
						</AlertDescription>
					</Alert>
				</div>
			)}
			<div className='flex space-x-3 border-b-2 p-4'>
				<Link
					href={`/users/${answer.owner.username}`}
					aria-label={answer.owner.username}
					className='h-fit'
				>
					<AvatarWithBadge user={answer.owner} />
				</Link>
				<div className='grow space-y-1'>
					<div className='flex items-center space-x-2 text-[#696984] max-w-full'>
						<Link
							className='cursor-pointer font-medium decoration-2 hover:underline break-all line-clamp-1 max-w-[38%] md:max-w-[50%]'
							href={`/users/${answer.owner.username}`}
							title={answer.owner.name ?? answer.owner.username}
						>
							{answer.owner.name}
						</Link>
						<Link
							className='font-normal break-all line-clamp-1 max-w-[23%] md:max-w-[34%]'
							href={`/users/${answer.owner.username}`}
							title={`@${answer.owner.username}`}
						>
							@{answer.owner.username}
						</Link>
						<Link className='font-light' href={`/questions/${question.slug}`}>
							<span className='mr-2 text-sm font-medium'>·</span>
							<span
								className='hover:underline'
								title={formatLongDateTime(answer.createdAt)}
							>
								{getFromNowTime(answer.createdAt)}
							</span>
							{answer.createdAt.getTime() !== answer.updatedAt.getTime() && (
								<span
									className='ml-1 hover:underline'
									title={`Diedit pada ${formatLongDateTime(answer.updatedAt)}`}
								>
									*
								</span>
							)}
						</Link>
					</div>
					<p
						className={clsx(
							'whitespace-pre-wrap text-sm leading-relaxed text-[#696984]',
							isOpen || 'line-clamp-4',
						)}
						ref={ref}
					>
						{answer.content}
					</p>
					{showReadMoreButton && (
						<button
							className='text-sm font-medium text-[#696984] hover:underline'
							onClick={() => setIsOpen((v) => !v)}
							type='button'
						>
							Tampilkan lebih {isOpen ? 'sedikit' : 'banyak'}
						</button>
					)}
					<div className='flex flex-wrap-reverse items-center gap-4 pt-4 text-[#696984] justify-between'>
						<div className='flex flex-wrap gap-2'>
							<DropdownMenu
								open={isShowRatingDropdown}
								onOpenChange={setIsShowRatingDropdown}
							>
								<DropdownMenuTrigger
									asChild
									onPointerDown={(e) => e.preventDefault()}
									onClick={() => setIsShowRatingDropdown((v) => !v)}
								>
									<Button
										className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
										size='sm'
										title='Beri nilai'
										variant='ghost'
										disabled={
											!session ||
											ratingMutation.isLoading ||
											session.user.id === answer.owner.id
										}
									>
										<>
											{ratingFromMe ? (
												<Star
													className='mr-2'
													color='#F48C06'
													fill='#F48C06'
													size={18}
												/>
											) : (
												<Star className='mr-2' size={18} />
											)}
										</>
										<span>{answer.numberOfVotes}</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className='text-[#696984]'>
									<DropdownMenuLabel>Beri nilai</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<div className='flex justify-center p-2' dir='rtl'>
										<StarIcon
											className='peer cursor-pointer fill-white hover:fill-[#F48C06] peer-hover:fill-[#F48C06]'
											color='#F48C06'
											onClick={() => handleRating(5)}
										/>
										<StarIcon
											className='peer cursor-pointer fill-white hover:fill-[#F48C06] peer-hover:fill-[#F48C06]'
											color='#F48C06'
											onClick={() => handleRating(4)}
										/>
										<StarIcon
											className='peer cursor-pointer fill-white hover:fill-[#F48C06] peer-hover:fill-[#F48C06]'
											color='#F48C06'
											onClick={() => handleRating(3)}
										/>
										<StarIcon
											className='peer cursor-pointer fill-white hover:fill-[#F48C06] peer-hover:fill-[#F48C06]'
											color='#F48C06'
											onClick={() => handleRating(2)}
										/>
										<StarIcon
											className='peer cursor-pointer fill-white hover:fill-[#F48C06] peer-hover:fill-[#F48C06]'
											color='#F48C06'
											onClick={() => handleRating(1)}
										/>
									</div>
									{ratingFromMe && (
										<Button
											size='sm'
											className='mt-2 w-full'
											disabled={deleteRatingMutation.isLoading}
											onClick={() => handleDeleteRating(answer.id)}
										>
											{deleteRatingMutation.isLoading
												? 'Loading...'
												: `Batalkan nilai (${ratingFromMe})`}
										</Button>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
							{question.owner.id === session?.user.id && (
								<Button
									className='rounded-full text-sm hover:bg-slate-100 hover:text-[#696984]'
									size='sm'
									title={
										answer.isBestAnswer
											? 'Batalkan jawaban terbaik'
											: 'Tandai sebagai jawaban terbaik'
									}
									variant='ghost'
									disabled={bestAnswerMutation.isLoading}
									onClick={() => handleBestAnswer(answer.id)}
								>
									<>
										{answer.isBestAnswer ? (
											<CheckCircle color='green' size={18} />
										) : (
											<CheckCircle size={18} />
										)}
									</>
								</Button>
							)}
							{answer.owner.id === session?.user.id && (
								<DropdownMenu
									open={isShowDropdown}
									onOpenChange={setIsShowDropDown}
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
										<EditAnswerModal
											question={{
												content: question.content,
												createdAt: question.createdAt,
												subject: question.subject,
												updatedAt: question.updatedAt,
												owner: question.owner,
											}}
											session={session}
											answer={{
												id: answer.id,
												content: answer.content,
											}}
										>
											<DropdownMenuItem
												onSelect={(event) => event.preventDefault()}
											>
												<PencilIcon className='mr-2' size={18} />
												<span>Edit</span>
											</DropdownMenuItem>
										</EditAnswerModal>
										<DeleteModal
											description='Apakah Anda yakin ingin menghapus jawaban ini?'
											onClick={() => handleDelete(answer.id)}
											onOpenChange={setIsShowDeleteModal}
											open={isShowDeleteModal}
											title='Hapus jawaban'
										>
											<DropdownMenuItem
												className='focus:bg-red-100 focus:text-red-900'
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
						{averageRating > 0 && (
							<div className='flex items-center gap-1'>
								<span className='text-[#696984]'>
									({averageRating.toFixed(1)})
								</span>
								<StarRating rating={averageRating} />
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
