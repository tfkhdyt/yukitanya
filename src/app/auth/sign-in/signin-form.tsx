'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Facebook } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { match } from 'ts-pattern';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const signinSchema = z.object({
	password: z
		.string({ required_error: 'Password tidak boleh kosong' })
		.min(8, 'Password harus lebih dari 8 karakter'),
	username: z
		.string({ required_error: 'Username tidak boleh kosong' })
		.min(4, 'Username tidak boleh kurang dari 4 karakter')
		.max(25, 'Username tidak boleh lebih dari 25 karakter')
		.trim(),
});

type SigninSchema = z.infer<typeof signinSchema>;

export function SigninForm() {
	const [isPasswordShowed, setIsPasswordShowed] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<SigninSchema>({
		resolver: zodResolver(signinSchema),
	});

	const onSubmit = async (values: SigninSchema) => {
		setIsLoading(true);

		const result = await signIn('credentials', {
			password: values.password,
			redirect: false,
			username: values.username,
		});

		if (!result?.ok && result?.error) {
			setIsLoading(false);

			return toast.error(result.error);
		}
		setIsLoading(false);

		window.location.replace('/home');
	};

	return (
		<>
			<Form {...form}>
				<form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input
										placeholder='Username'
										{...field}
										className='rounded-full'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<span className='flex space-x-2'>
										<Input
											placeholder='Password'
											type={isPasswordShowed ? 'text' : 'password'}
											{...field}
											className='rounded-full'
										/>
										<Button
											aria-label='Show password'
											className='rounded-full p-2'
											onClick={() => setIsPasswordShowed((v) => !v)}
											tabIndex={-1}
											type='button'
											variant='outline'
										>
											{match(isPasswordShowed)
												.with(true, () => <EyeOff size={20} />)
												.with(false, () => <Eye size={20} />)
												.exhaustive()}
										</Button>
									</span>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex justify-end'>
						<button
							className='text-xs font-medium hover:underline cursor-pointer'
							type='button'
							onClick={() =>
								toast('Rileks... Dan coba ingat-ingat lagi', {
									icon: '😅',
								})
							}
						>
							Lupa password?
						</button>
					</div>

					<Button
						className='hover:bg-slate-80 w-full rounded-full bg-[#77425A] focus-visible:ring-[#77425A]'
						disabled={isLoading}
						type='submit'
					>
						{isLoading ? 'Loading...' : 'Masuk'}
					</Button>
				</form>
			</Form>
			<p className='mt-4 text-center text-sm font-medium'>atau masuk dengan</p>
			<div className='mt-4 flex items-center justify-center space-x-2'>
				<Button
					className='rounded-full'
					title='Masuk dengan Google'
					variant='outline'
					onClick={() =>
						signIn('google', {
							callbackUrl: '/home',
						})
					}
				>
					<Image
						alt='Google'
						className='ml-1'
						height={20}
						src='/img/icon/google.png'
						width={20}
					/>
				</Button>
				<Button
					className='rounded-full'
					title='Masuk dengan Facebook'
					variant='outline'
					onClick={() =>
						signIn('facebook', {
							callbackUrl: '/home',
						})
					}
				>
					<Facebook color='black' />
				</Button>
			</div>
			<p className='mt-4 text-center text-sm font-medium'>
				Belum punya akun?{' '}
				<Link
					className='font-semibold text-[#00B6EF] underline'
					href='/auth/sign-up'
				>
					Daftar
				</Link>
			</p>
		</>
	);
}
