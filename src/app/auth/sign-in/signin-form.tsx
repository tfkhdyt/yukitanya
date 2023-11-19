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

  const form = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = (values: SigninSchema) => {
    console.log(values);
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
          <p className='text-right text-xs font-medium'>Lupa password?</p>
          <Button
            className='hover:bg-slate-80 w-full rounded-full bg-[#77425A] focus-visible:ring-[#77425A]'
            type='submit'
          >
            Masuk
          </Button>
        </form>
      </Form>
      <p className='mt-4 text-center text-sm font-medium'>atau masuk dengan</p>
      <div className='mt-4 flex items-center justify-center space-x-2'>
        <Button
          className='rounded-full'
          title='Masuk dengan Google'
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
          title='Masuk dengan Facebook'
          variant='outline'
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
