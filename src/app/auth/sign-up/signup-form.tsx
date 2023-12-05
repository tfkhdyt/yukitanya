'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { Eye, EyeOff, Facebook } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { match } from 'ts-pattern';

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
import { environment } from '@/environment.mjs';
import { type SignupSchema, signupSchema } from '@/schema/signup-schema';
import { api } from '@/trpc/react';

export function SignupForm() {
	const [isPasswordShowed, setIsPasswordShowed] = useState(false);
	const [isConfirmPasswordShowed, setIsConfirmPasswordShowed] = useState(false);

	const form = useForm<SignupSchema>({
		resolver: zodResolver(signupSchema),
	});
	const router = useRouter();
	const { isLoading, mutate } = api.user.register.useMutation({
		onError: (error) => toast.error(error.message),
		onSuccess: () => {
			toast.success(
				'Registrasi berhasil!\nAnda akan segera diarahkan ke halaman sign-in',
			);
			setTimeout(() => {
				router.push('/auth/sign-in');
			}, 3e3);
		},
	});

	const [token, setToken] = useState('');
	const captcha = useRef<TurnstileInstance>();

	const onSubmit = (values: SignupSchema) => {
		mutate({
			confirmPassword: values.confirmPassword,
			email: values.email,
			firstName: values.firstName,
			lastName: values.lastName,
			password: values.password,
			username: values.username,
			token,
		});

		captcha.current?.reset();
	};

	return (
		<>
			<Form {...form}>
				<form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
					<div className='flex flex-col gap-4 md:flex-row'>
						<FormField
							control={form.control}
							name='firstName'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nama depan</FormLabel>
									<FormControl>
										<Input
											placeholder='Nama depan'
											{...field}
											className='w-full rounded-full md:w-52'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='lastName'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nama belakang</FormLabel>
									<FormControl>
										<Input
											placeholder='Nama belakang'
											{...field}
											className='w-full rounded-full md:w-52'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
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
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder='Email'
										type='email'
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
					<FormField
						control={form.control}
						name='confirmPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ulangi password</FormLabel>
								<FormControl>
									<span className='flex space-x-2'>
										<Input
											placeholder='Ulangi password'
											type={isConfirmPasswordShowed ? 'text' : 'password'}
											{...field}
											className='rounded-full'
										/>
										<Button
											aria-label='Show confirm password'
											className='rounded-full p-2'
											onClick={() => setIsConfirmPasswordShowed((v) => !v)}
											tabIndex={-1}
											type='button'
											variant='outline'
										>
											{match(isConfirmPasswordShowed)
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

					<Turnstile
						siteKey={environment.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
						onSuccess={setToken}
						ref={captcha}
						options={{
							theme: 'light',
						}}
					/>
					<Button
						className='hover:bg-slate-80 w-full rounded-full bg-[#77425A] focus-visible:ring-[#77425A]'
						disabled={isLoading}
						type='submit'
					>
						{isLoading ? 'Loading...' : 'Buat akun'}
					</Button>
				</form>
			</Form>
			<p className='mt-4 text-center text-sm font-medium'>atau daftar dengan</p>
			<div className='mt-4 flex items-center justify-center space-x-2'>
				<Button
					className='rounded-full'
					title='Daftar dengan Google'
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
					title='Daftar dengan Facebook'
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
				Sudah punya akun?{' '}
				<Link
					className='font-semibold text-[#00B6EF] underline'
					href='/auth/sign-in'
				>
					Masuk
				</Link>
			</p>
		</>
	);
}
