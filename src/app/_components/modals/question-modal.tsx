'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import clsx from 'clsx';
import cuid from 'cuid';
import { SendIcon } from 'lucide-react';
import Link from 'next/link';
import { type ReactNode, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import slugify from 'slugify';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { mapel } from '@/constants/mapel';
import { environment } from '@/environment.mjs';
import { getDiceBearAvatar } from '@/lib/utils';
import { type User } from '@/server/auth';
import { api } from '@/trpc/react';

const questionSchema = z.object({
	question: z
		.string({ required_error: 'Pertanyaan tidak boleh kosong' })
		.min(1, 'Pertanyaan tidak boleh kosong')
		.max(1000, 'Pertanyaan tidak boleh lebih dari 1000 karakter'),
	subject: z
		.string({ required_error: 'Pilih salah satu mapel' })
		.min(1, 'Mapel tidak boleh kosong')
		.max(25),
});

export function QuestionModal({
	children,
	user,
	defaultSubject,
}: {
	children: ReactNode;
	user: User;
	defaultSubject?: string;
}) {
	const [open, setOpen] = useState(false);
	const form = useForm<z.infer<typeof questionSchema>>({
		resolver: zodResolver(questionSchema),
		defaultValues: {
			subject: defaultSubject,
		},
	});
	const questionLength = form.watch('question')?.length ?? 0;

	const [token, setToken] = useState('');
	const captcha = useRef<TurnstileInstance>();

	const utils = api.useUtils();
	const { isLoading, mutate } = api.question.createQuestion.useMutation({
		onError: (error) => toast.error(error.message),
		onSuccess: async () => {
			toast.success('Pertanyaanmu telah berhasil dibuat');
			setOpen(false);
			form.reset();
			await utils.question.invalidate();
			await utils.user.findUserStatByUsername.invalidate();
		},
		onSettled: () => captcha.current?.reset(),
	});

	function onSubmit(values: z.infer<typeof questionSchema>) {
		const id = cuid();
		const input = {
			content: values.question,
			id: `question-${id}`,
			slug:
				slugify(values.question.slice(0, 50), { strict: true }) +
				`-${id.slice(-5)}`,
			subjectId: values.subject,
			userId: user.id,
			token,
		};

		mutate({ schema: input, token });
	}

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Ajukan pertanyaan</DialogTitle>
					<div className='-mx-4 px-4 pt-4'>
						<div className='flex items-center space-x-3'>
							<Link href={`/users/${user.username}`} aria-label={user.username}>
								<Avatar>
									<AvatarImage
										src={user.image ?? getDiceBearAvatar(user.username)}
										alt={`${user.name} avatar`}
									/>
									<AvatarFallback>{user.initial}</AvatarFallback>
								</Avatar>
							</Link>
							<div className='text-left text-[#696984]'>
								<Link
									className='block max-w-[16rem] md:max-w-md cursor-pointer truncate font-medium decoration-2 hover:underline'
									href={`/users/${user.username}`}
									title={user.name ?? user.username}
								>
									{user.name}
								</Link>
								<Link
									className='block max-w-[16rem] md:max-w-md truncate font-normal'
									href={`/users/${user.username}`}
									title={`@${user.username}`}
								>
									@{user.username}
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
										name='question'
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Textarea
														placeholder='Ketik pertanyaan mu di sini'
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
												questionLength > 1000 && 'font-semibold text-red-700',
											)}
										>
											{questionLength}
										</span>
										/1000
									</p>
									<div className='flex justify-between'>
										<FormField
											control={form.control}
											name='subject'
											render={({ field }) => (
												<FormItem>
													<Select
														defaultValue={field.value}
														onValueChange={field.onChange}
													>
														<FormControl>
															<SelectTrigger className='w-[200px]'>
																<SelectValue placeholder='Mata pelajaran' />
															</SelectTrigger>
														</FormControl>

														<SelectContent>
															{mapel.map((each) => (
																<SelectItem key={each.id} value={each.id}>
																	{each.name}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Button
											className='rounded-full font-semibold'
											disabled={isLoading}
											type='submit'
										>
											<SendIcon className='mr-1' size={16} />
											{isLoading ? 'Loading...' : 'Kirim'}
										</Button>
									</div>
									<Turnstile
										siteKey={environment.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
										onSuccess={setToken}
										ref={captcha}
										options={{
											theme: 'light',
										}}
									/>
								</form>
							</Form>
						</div>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
