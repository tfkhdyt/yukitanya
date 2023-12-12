'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import clsx from 'clsx';
import { SendIcon } from 'lucide-react';
import { type Session } from 'next-auth';
import Link from 'next/link';
import { type ReactNode, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

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
import { environment } from '@/environment.mjs';
import { formatLongDateTime, getFromNowTime } from '@/lib/datetime';
import { type User } from '@/server/auth';
import { api } from '@/trpc/react';
import { AvatarWithBadge } from '../avatar-with-badge';

const answerSchema = z.object({
	answer: z
		.string({ required_error: 'Jawaban tidak boleh kosong' })
		.min(1, 'Jawaban tidak boleh kosong')
		.max(1000, 'Jawaban tidak boleh lebih dari 1000 karakter'),
});

type Question = {
	content: string;
	createdAt: Date;
	updatedAt: Date;
	subject: {
		id: string;
		name: string;
	};
	owner: User;
};

type Answer = {
	id: string;
	content: string;
};

export function EditAnswerModal({
	children,
	question,
	session,
	answer,
}: {
	children: ReactNode;
	question: Question;
	session: Session;
	answer: Answer;
}) {
	const form = useForm<z.infer<typeof answerSchema>>({
		defaultValues: {
			answer: answer.content,
		},
		resolver: zodResolver(answerSchema),
	});
	const answerLength = form.watch('answer').length;
	const [open, setOpen] = useState(false);

	const [token, setToken] = useState('');
	const captcha = useRef<TurnstileInstance>();

	const utils = api.useUtils();
	const { mutate } = api.answer.updateAnswerById.useMutation({
		onError: (error) => {
			toast.dismiss();
			toast.error(error.message);
		},
		onSuccess: async () => {
			toast.dismiss();
			toast.success('Jawabanmu telah berhasil diedit');

			form.reset();
			await Promise.allSettled([
				utils.answer.invalidate(),
				utils.user.invalidate(),
			]);
			// await utils.question.findQuestionMetadata.invalidate();
		},
		onSettled: () => captcha.current?.reset(),
	});

	function onSubmit(values: z.infer<typeof answerSchema>) {
		setOpen(false);
		toast.loading('Jawabanmu sedang diproses, mohon tunggu beberapa saat...');
		mutate({
			content: values.answer,
			id: answer.id,
			token,
		});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Edit jawaban</DialogTitle>
					<div className='-mx-4 flex space-x-3 border-b-2 p-4'>
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
								<div className='font-light'>
									<span className='mr-2 text-sm font-medium'>·</span>
									<span
										className='hover:underline'
										title={formatLongDateTime(question.createdAt)}
									>
										{getFromNowTime(question.createdAt)}
									</span>
									{question.createdAt.getTime() !==
										question.updatedAt.getTime() && (
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
							<Link
								href={`/users/${session.user.username}`}
								aria-label={session.user.username}
							>
								<AvatarWithBadge user={session.user} />
							</Link>
							<div className='text-left text-[#696984]'>
								<Link
									className='block max-w-[16rem] md:max-w-md cursor-pointer truncate font-medium decoration-2 hover:underline'
									href={`/users/${session.user.username}`}
									title={session.user.name ?? session.user.username}
								>
									{session.user.name}
								</Link>
								<Link
									className='block max-w-[16rem] md:max-w-md truncate font-normal'
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
									<div className='flex justify-between flex-wrap-reverse gap-4 items-center'>
										<Turnstile
											siteKey={environment.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
											onSuccess={setToken}
											ref={captcha}
											options={{
												theme: 'light',
											}}
										/>
										<Button
											className='rounded-full font-semibold ml-auto'
											type='submit'
										>
											<SendIcon className='mr-1' size={16} />
											Kirim
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
