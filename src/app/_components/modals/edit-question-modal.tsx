'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { ImagePlusIcon, SendIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { type ReactNode, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import slugify from 'slugify';
import { z } from 'zod';

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
import { useUploadThing } from '@/lib/uploadthing/client';
import { type User } from '@/server/auth';
import { api } from '@/trpc/react';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import Image from 'next/image';
import { AvatarWithBadge } from '../avatar-with-badge';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const questionSchema = z.object({
	question: z
		.string({ required_error: 'Pertanyaan tidak boleh kosong' })
		.min(1, 'Pertanyaan tidak boleh kosong')
		.max(1000, 'Pertanyaan tidak boleh lebih dari 1000 karakter')
		.trim(),
	subject: z
		.string({ required_error: 'Pilih salah satu mapel' })
		.min(1, 'Mapel tidak boleh kosong')
		.max(25),
});

type Question = {
	content: string;
	id: string;
	subject: {
		id: string;
		name: string;
	};
	owner: User;
	images: {
		id: string;
		url: string;
	}[];
};

export function EditQuestionModal({
	children,
	question,
	user,
}: {
	children: ReactNode;
	question: Question;
	title?: string;
	user: User;
}) {
	const [open, setOpen] = useState(false);
	const form = useForm<z.infer<typeof questionSchema>>({
		defaultValues: {
			question: question.content,
			subject: question.subject.id,
		},
		resolver: zodResolver(questionSchema),
	});
	const questionLength = form.watch('question').length;

	const [token, setToken] = useState('');
	const captcha = useRef<TurnstileInstance>();

	const [files, setFiles] = useState<File[]>([]);
	const fileRef = useRef<HTMLInputElement>(null);

	const utils = api.useUtils();
	const { isLoading, mutate } = api.question.updateQuestionById.useMutation({
		onError: (error) => {
			toast.dismiss();
			toast.error(error.message);
		},
		onSuccess: async () => {
			toast.dismiss();
			toast.success('Pertanyaanmu telah berhasil diedit');

			form.reset();
			await Promise.allSettled([
				utils.question.invalidate(),
				utils.user.findMostActiveUsers.invalidate(),
				utils.favorite.findAllFavoritedQuestions.invalidate(),
			]);
		},
		onSettled: () => captcha.current?.reset(),
	});

	const { startUpload } = useUploadThing('questionImageUploader', {
		onUploadError: (error) => {
			console.error(error.message);
			toast.dismiss();
			toast.error('Gagal mengupload gambar');
		},
	});

	const onSubmit = async (values: z.infer<typeof questionSchema>) => {
		setOpen(false);
		toast.loading(
			'Pertanyaanmu sedang diproses, mohon tunggu beberapa saat...',
		);

		let imagesMetadata: {
			id: string;
			url: string;
		}[] = [];
		if (files.length > 0) {
			const result = await startUpload(files);
			if (!result) {
				return;
			}

			imagesMetadata = result?.map((r) => ({ id: r.key, url: r.url })) ?? [];
		}

		mutate({
			schema: {
				content: values.question,
				id: question.id,
				slug:
					slugify(values.question.slice(0, 50), { strict: true }) +
					`-${question.id.replace('question-', '').slice(-5)}`,
				subjectId: values.subject,
				userId: question.owner.id,
			},
			token,
			images: imagesMetadata,
		});
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='md:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Edit pertanyaan</DialogTitle>
					<div className='-mx-4 px-4 pt-4'>
						<div className='flex items-center space-x-3'>
							<Link
								href={`/users/${question.owner.username}`}
								aria-label={question.owner.username}
							>
								<AvatarWithBadge user={question.owner} />
							</Link>
							<div className='text-left text-[#696984]'>
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
												{user.membership ? (
													<Button
														className='font-normal rounded-full'
														variant='outline'
														onClick={(e) => {
															e.preventDefault();
															fileRef.current?.click();
														}}
													>
														<ImagePlusIcon size={18} className='mr-2' />
														{question.images.length > 0
															? 'Ganti gambar'
															: 'Tambah gambar'}
													</Button>
												) : (
													<Popover>
														<PopoverTrigger asChild>
															<Button
																className='font-normal rounded-full'
																variant='outline'
															>
																<ImagePlusIcon size={18} className='mr-2' />
																{question.images.length > 0
																	? 'Ganti gambar'
																	: 'Tambah gambar'}
															</Button>
														</PopoverTrigger>
														<PopoverContent className='text-[#696984] font-medium rounded-xl'>
															Anda harus menjadi pengguna{' '}
															<Link
																href='/premium'
																className='font-bold hover:underline'
																onClick={() => setOpen(false)}
															>
																Premium
															</Link>{' '}
															untuk menggunakan fitur ini.
														</PopoverContent>
													</Popover>
												)}

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
															toast.dismiss();
															return toast.error(
																'Maksimal 4 gambar yang bisa diupload',
															);
														}
														for (const file of files) {
															if (file.size > 512000) {
																toast.dismiss();
																return toast.error(
																	'Ukuran gambar tidak boleh lebih dari 512KB',
																);
															}
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
															<SelectTrigger className='w-fit rounded-full'>
																<SelectValue placeholder='Mata pelajaran' />
															</SelectTrigger>
														</FormControl>

														<SelectContent className='rounded-lg'>
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
