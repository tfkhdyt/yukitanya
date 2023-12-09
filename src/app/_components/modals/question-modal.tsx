'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import clsx from 'clsx';
import cuid from 'cuid';
import { ImagePlusIcon, SendIcon, XIcon } from 'lucide-react';
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
import { useUploadThing } from '@/lib/uploadthing';
import { getDiceBearAvatar } from '@/lib/utils';
import { type User } from '@/server/auth';
import { api } from '@/trpc/react';
import Image from 'next/image';
import { Input } from '../ui/input';

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
	const [files, setFiles] = useState<File[]>([]);
	const fileRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);

	const utils = api.useUtils();
	const { isLoading, mutate } = api.question.createQuestion.useMutation({
		onError: (error) => toast.error(error.message),
		onSuccess: async () => {
			toast.success('Pertanyaanmu telah berhasil dibuat');
			setOpen(false);
			form.reset();
			setFiles([]);
			await utils.question.invalidate();
			await utils.user.findUserStatByUsername.invalidate();
		},
		onSettled: () => captcha.current?.reset(),
	});

	const { startUpload } = useUploadThing('questionImageUploader', {
		onUploadError: (error) => {
			console.error(error.message);
			toast.error('Gagal mengupload gambar');
		},
		onUploadProgress: () => {
			setIsUploading(true);
		},
		onClientUploadComplete: () => {
			setIsUploading(false);
		},
	});

	const onSubmit = async (values: z.infer<typeof questionSchema>) => {
		let imagesMetadata: {
			id: string;
			url: string;
		}[] = [];
		if (files.length > 0) {
			const result = await startUpload(files);
			imagesMetadata = result?.map((r) => ({ id: r.key, url: r.url })) ?? [];
		}

		const id = cuid();
		const input = {
			content: values.question,
			id: `question-${id}`,
			slug:
				slugify(values.question.slice(0, 50), { strict: true }) +
				`-${id.slice(-5)}`,
			subjectId: values.subject,
			userId: user.id,
		};

		mutate({ schema: input, token, image: imagesMetadata });
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent
				className='md:max-w-2xl'
				onInteractOutside={(e) => e.preventDefault()}
			>
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
									<div className='flex justify-between flex-wrap-reverse'>
										<div>
											<div className='grid w-fit max-w-sm items-center gap-1.5'>
												<Button
													className='font-normal'
													variant='outline'
													onClick={(e) => {
														e.preventDefault();
														fileRef.current?.click();
													}}
												>
													<ImagePlusIcon size={18} className='mr-2' />
													Upload gambar (Maks. 4)
												</Button>
												<Input
													accept='image/*'
													id='picture'
													type='file'
													multiple
													ref={fileRef}
													className='hidden'
													onChange={(e) => {
														const files = e.target.files;
														if (!files) return;
														if (files.length > 4) {
															return toast.error(
																'Maksimal 4 gambar yang bisa diupload',
															);
														}

														setFiles([...files]);
													}}
												/>
											</div>
											{files.length > 0 && (
												<div className='grid mt-4 grid-cols-2 md:grid-cols-4 gap-4'>
													{files.map((file) => (
														<div className='relative group' key={file.name}>
															<Image
																src={URL.createObjectURL(file)}
																alt={file.name}
																height={100}
																width={100}
																className='object-cover aspect-square'
															/>
															<div className='invisible group-hover:visible w-[100px] h-[100px] absolute inset-0 bg-gradient-to-bl from-slate-700/50 via-slate-700/25 to-transparent' />
															<button
																className='absolute top-0 right-0 p-2 invisible group-hover:visible'
																type='button'
																onClick={() => {
																	setFiles((files) => {
																		return files.filter(
																			(f) => f.name !== file.name,
																		);
																	});
																}}
															>
																<XIcon
																	size={18}
																	strokeWidth={3}
																	color='white'
																/>
															</button>
														</div>
													))}
												</div>
											)}
										</div>

										<div className='text-[#696984]'>
											<span
												className={clsx(
													questionLength > 1000 && 'font-semibold text-red-700',
												)}
											>
												{questionLength}
											</span>
											/1000
										</div>
									</div>

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
											disabled={isLoading || isUploading}
											type='submit'
										>
											<SendIcon className='mr-1' size={16} />
											{isLoading || isUploading ? 'Loading...' : 'Kirim'}
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
