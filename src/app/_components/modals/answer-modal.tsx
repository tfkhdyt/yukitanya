'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import cuid from 'cuid';
import { SendIcon } from 'lucide-react';
import { type Session } from 'next-auth';
import Link from 'next/link';
import { type ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { formatLongDateTime, getFromNowTime } from '@/lib/datetime';
import { getDiceBearAvatar } from '@/lib/utils';
import { type User } from '@/server/auth';
import { api } from '@/trpc/react';

const answerSchema = z.object({
	answer: z
		.string({ required_error: 'Jawaban tidak boleh kosong' })
		.min(1, 'Jawaban tidak boleh kosong')
		.max(1000, 'Jawaban tidak boleh lebih dari 1000 karakter'),
});

type Question = {
	id: string;
	content: string;
	createdAt: Date;
	subject: {
		id: string;
		name: string;
	};
	updatedAt: Date;
	owner: User;
};

export function AnswerModal({
	children,
	question,
	session,
}: {
	children: ReactNode;
	question: Question;
	session: Session;
}) {
	const form = useForm<z.infer<typeof answerSchema>>({
		resolver: zodResolver(answerSchema),
	});
	const utils = api.useUtils();
	const [open, setOpen] = useState(false);
	const { mutate, isLoading } = api.answer.createAnswer.useMutation({
		onError: (error) => toast.error(error.message),
		onSuccess: async () => {
			toast.success('Jawabanmu telah berhasil ditambahkan');
			setOpen(false);
			form.reset();
			await utils.answer.findAllAnswersByQuestionId.invalidate();
			await utils.question.invalidate();
			await utils.favorite.findAllFavoritedQuestions.invalidate();
			await utils.user.findUserStatByUsername.invalidate();
		},
	});

	function onSubmit(values: z.infer<typeof answerSchema>) {
		mutate({
			content: values.answer,
			id: `answer-${cuid()}`,
			questionId: question.id,
			userId: session.user.id,
		});
	}

	const answerLength = form.watch('answer')?.length ?? 0;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Tambah jawaban</DialogTitle>
					<div className='-mx-4 flex space-x-3 border-b-2 p-4'>
						<Avatar>
							<AvatarImage
								src={
									question.owner.image ??
									getDiceBearAvatar(question.owner.username)
								}
								alt={`${question.owner.name} avatar`}
							/>
							<AvatarFallback>{question.owner.initial}</AvatarFallback>
						</Avatar>
						<div className='grow space-y-1'>
							<div className='flex items-center space-x-2 text-[#696984]'>
								<Link
									className='max-w-[6.25rem] cursor-pointer truncate font-medium decoration-2 hover:underline md:max-w-[12rem]'
									href={`/users/${question.owner.username}`}
									title={question.owner.name ?? question.owner.username}
								>
									{question.owner.name}
								</Link>
								<Link
									className='max-w-[6.25rem] truncate font-normal md:max-w-[12rem]'
									href={`/users/${question.owner.username}`}
									title={`@${question.owner.username}`}
								>
									@{question.owner.username}
								</Link>
								<div className='font-light'>
									<span className='mr-2 text-sm font-medium'>·</span>
									<span
										className='hover:underline'
										title={formatLongDateTime(question.createdAt)}
									>
										{getFromNowTime(question.createdAt)}
									</span>
									{question.createdAt.toISOString() !==
										question.updatedAt.toISOString() && (
										<span
											className='ml-1 hover:underline'
											title={`Diedit pada ${formatLongDateTime(
												question.updatedAt,
											)}`}
										>
											*
										</span>
									)}
								</div>
							</div>
							<p className='line-clamp-4 whitespace-pre-wrap text-left text-sm leading-relaxed text-[#696984]'>
								{question.content}
							</p>
							<div className='flex justify-start'>
								<Link
									href={`/subjects/${question.subject.id}`}
									className={clsx(
										badgeVariants({ variant: 'secondary' }),
										'mt-4 hover:bg-gray-200',
									)}
								>
									{question.subject.name}
								</Link>
							</div>
						</div>
					</div>
					<div className='pt-2'>
						<div className='flex items-center space-x-3'>
							<Avatar>
								<AvatarImage
									src={
										session?.user.image ??
										getDiceBearAvatar(session?.user.username)
									}
									alt={`${session?.user.name} avatar`}
								/>
								<AvatarFallback>{session.user.initial}</AvatarFallback>
							</Avatar>
							<div className='text-left text-[#696984]'>
								<Link
									className='block max-w-full cursor-pointer truncate font-medium decoration-2 hover:underline'
									href={`/users/${session.user.username}`}
									title={session.user.name ?? session.user.username}
								>
									{session.user.name}
								</Link>
								<Link
									className='block max-w-full truncate font-normal'
									href={`/users/${session.user.username}`}
									title={`@${session.user.username}`}
								>
									@{session.user.username}
								</Link>
							</div>
						</div>

						<div className='py-2'>
							<Form {...form}>
								<form
									className='space-y-4'
									onSubmit={form.handleSubmit(onSubmit)}
								>
									<FormField
										control={form.control}
										name='answer'
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Textarea
														placeholder='Ketik jawaban mu di sini'
														rows={5}
														{...field}
														className='mt-2'
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<p className='text-right text-[#696984]'>
										<span
											className={clsx(
												answerLength > 1000 && 'font-semibold text-red-700',
											)}
										>
											{answerLength}
										</span>
										/1000
									</p>
									<div className='flex justify-end'>
										<Button
											className='rounded-full font-semibold'
											type='submit'
											disabled={isLoading}
										>
											<SendIcon className='mr-1' size={16} />
											{isLoading ? 'Loading...' : 'Kirim'}
										</Button>
									</div>
								</form>
							</Form>
						</div>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
