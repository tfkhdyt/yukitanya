'use client';

import clsx from 'clsx';
import { debounce } from 'lodash';
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
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { DeleteModal } from '@/components/modals/delete-modal';
import { EditAnswerModal } from '@/components/modals/edit-answer-modal';
import { StarRating } from '@/components/star-rating';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatLongDateTime, getFromNowTime } from '@/lib/datetime';
import { getDiceBearAvatar } from '@/lib/utils';
import { type User } from '@/server/auth';
import { api } from '@/trpc/react';

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

	const utils = api.useUtils();
	const deleteAnswerMutation = api.answer.deleteAnswerById.useMutation({
		onError: () => toast.error('Gagal menghapus jawaban'),
		onSuccess: async () => {
			toast.success('Jawaban telah dihapus!');
			setIsShowDeleteModal(false);
			await utils.answer.invalidate();
			await utils.question.findQuestionMetadata.invalidate();
			await utils.user.findUserStatByUsername.invalidate();
		},
	});
	const [isShowDropdown, setIsShowDropDown] = useState(false);
	const [isShowRatingDropdown, setIsShowRatingDropdown] = useState(false);

	const handleDelete = (id: string) => {
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
		onSuccess: async () => {
			await utils.answer.invalidate();
		},
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
					<Avatar>
						<AvatarImage
							src={
								answer.owner.image ?? getDiceBearAvatar(answer.owner.username)
							}
							alt={`${answer.owner.name} avatar`}
						/>
						<AvatarFallback>{answer.owner.initial}</AvatarFallback>
					</Avatar>
				</Link>
				<div className='grow space-y-1'>
					<div className='flex items-center space-x-2 text-[#696984]'>
						<Link
							className='max-w-[5.5rem] cursor-pointer truncate font-medium decoration-2 hover:underline md:max-w-[12rem]'
							href={`/users/${answer.owner.username}`}
							title={answer.owner.name ?? answer.owner.username}
						>
							{answer.owner.name}
						</Link>
						<Link
							className='max-w-[5.5rem] truncate font-normal md:max-w-[12rem]'
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
							clamped && 'line-clamp-4',
						)}
						ref={containerReference}
					>
						{answer.content}
					</p>
					{showButton && (
						<button
							className='text-sm font-medium text-[#696984] hover:underline'
							onClick={handleReadMore}
							type='button'
						>
							Tampilkan lebih {clamped ? 'banyak' : 'sedikit'}
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
											setShowDropdown={setIsShowDropDown}
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
