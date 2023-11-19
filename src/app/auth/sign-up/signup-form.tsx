'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Facebook } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { match } from 'ts-pattern';
import { z } from 'zod';

import { Button } from '../../_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../_components/ui/form';
import { Input } from '../../_components/ui/input';

const signupSchema = z
  .object({
    confirmPassword: z
      .string({ required_error: 'Confirm password tidak boleh kosong' })
      .min(8, 'Confirm password harus lebih dari 8 karakter'),
    email: z
      .string({ required_error: 'Email tidak boleh kosong' })
      .email('Email tidak valid')
      .trim(),
    firstName: z
      .string({ required_error: 'Nama depan tidak boleh kosong' })
      .min(1)
      .max(100, 'Nama depan tidak boleh lebih dari 100 karakter')
      .trim(),
    lastName: z
      .string()
      .max(100, 'Nama belakang tidak boleh lebih dari 100 karakter')
      .trim()
      .optional(),
    password: z
      .string({ required_error: 'Password tidak boleh kosong' })
      .min(8, 'Password harus lebih dari 8 karakter'),
    username: z
      .string({ required_error: 'Username tidak boleh kosong' })
      .min(4, 'Username tidak boleh kurang dari 4 karakter')
      .max(25, 'Username tidak boleh lebih dari 25 karakter')
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  });

type SignupSchema = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [isPasswordShowed, setIsPasswordShowed] = useState(false);
  const [isConfirmPasswordShowed, setIsConfirmPasswordShowed] = useState(false);

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (values: SignupSchema) => {
    console.log(values);
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

          <Button
            className='hover:bg-slate-80 w-full rounded-full bg-[#77425A] focus-visible:ring-[#77425A]'
            type='submit'
          >
            Buat akun
          </Button>
        </form>
      </Form>
      <p className='mt-4 text-center text-sm font-medium'>atau daftar dengan</p>
      <div className='mt-4 flex items-center justify-center space-x-2'>
        <Button
          className='rounded-full'
          title='Daftar dengan Google'
          variant='outline'
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
