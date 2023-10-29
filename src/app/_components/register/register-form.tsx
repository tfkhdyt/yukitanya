'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Facebook } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

const registerSchema = z
  .object({
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
    username: z
      .string({ required_error: 'Username tidak boleh kosong' })
      .min(4, 'Username tidak boleh kurang dari 4 karakter')
      .max(25, 'Username tidak boleh lebih dari 25 karakter')
      .trim(),
    email: z
      .string({ required_error: 'Email tidak boleh kosong' })
      .email('Email tidak valid')
      .trim(),
    password: z
      .string({ required_error: 'Password tidak boleh kosong' })
      .min(8, 'Password harus lebih dari 8 karakter'),
    confirmPassword: z
      .string({ required_error: 'Confirm password tidak boleh kosong' })
      .min(8, 'Confirm password harus lebih dari 8 karakter'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isPasswordShowed, setIsPasswordShowed] = useState(false);
  const [isConfirmPasswordShowed, setIsConfirmPasswordShowed] = useState(false);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (values: RegisterSchema) => {
    console.log(values);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
                      tabIndex={-1}
                      type='button'
                      className='rounded-full p-2'
                      variant='outline'
                      onClick={() => setIsPasswordShowed((v) => !v)}
                    >
                      {isPasswordShowed ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
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
                      tabIndex={-1}
                      type='button'
                      className='rounded-full p-2'
                      variant='outline'
                      onClick={() => setIsConfirmPasswordShowed((v) => !v)}
                    >
                      {isConfirmPasswordShowed ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </Button>
                  </span>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='w-full rounded-full bg-[#77425A] hover:bg-slate-800'
          >
            Buat akun
          </Button>
        </form>
      </Form>
      <p className='mt-4 text-center text-sm font-medium'>atau daftar dengan</p>
      <div className='mt-4 flex items-center justify-center space-x-2'>
        <Button
          variant='outline'
          className='rounded-full'
          title='Daftar dengan Google'
        >
          <Image
            src='/img/icon/google.png'
            height={20}
            width={20}
            alt='Google'
            className='ml-1'
          />
        </Button>
        <Button
          variant='outline'
          className='rounded-full'
          title='Daftar dengan Facebook'
        >
          <Facebook color='black' />
        </Button>
      </div>
      <p className='mt-4 text-center text-sm font-medium'>
        Sudah punya akun?{' '}
        <Link href='/auth/sign-in' className='text-[#00B6EF]'>
          Masuk
        </Link>
      </p>
    </>
  );
}
