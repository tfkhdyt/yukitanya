'use client';

import { Facebook, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';
import { Link } from 'react-scroll';

export function Footer() {
  return (
    <section className='bg-[#77425A] font-poppins'>
      <div className='container mx-auto divide-y-2'>
        <div className='flex flex-wrap items-center justify-between px-2 py-10'>
          <div className='flex w-1/2 items-center space-x-3 lg:w-auto'>
            <Image
              src='/img/yukitanya_logo.svg'
              alt='Yukitanya Logo'
              width={60}
              height={57}
              className='-mt-4'
            />
            <p className='font-rubik text-2xl font-extrabold text-white'>
              Yukitanya
            </p>
          </div>
          <p className='w-1/2 text-right text-white lg:w-auto lg:text-center'>
            © 2023 Copyright Kelompok 5 seKODlah Developing Future Tech
            Innovators{' '}
          </p>
          <div className='mt-6 space-x-4 lg:mt-auto'>
            <button className='rounded-lg bg-white p-2'>
              <Facebook />
            </button>
            <button className='rounded-lg bg-white p-2'>
              <Instagram />
            </button>
            <button className='rounded-lg bg-white p-2'>
              <Twitter />
            </button>
          </div>
        </div>
        <div className='flex py-10'>
          <div className='w-1/3 space-y-2 text-center text-white'>
            <h3 className='text-sm font-semibold'>Fitur</h3>
            <Link
              to='forum-tanya-jawab'
              smooth
              className='block cursor-pointer text-xs'
            >
              Forum tanya jawab
            </Link>
            <Link
              to='speech-to-text'
              smooth
              className='block cursor-pointer text-xs'
            >
              Speech to text
            </Link>
            <Link
              to='chat-room'
              smooth
              className='block cursor-pointer text-xs'
            >
              Course&apos;s chat room
            </Link>
            <Link
              to='private-chat'
              smooth
              className='block cursor-pointer text-xs'
            >
              Private chat
            </Link>
          </div>
          <div className='w-1/3 space-y-2 text-center text-white'>
            <h3 className='text-sm font-semibold'>Help</h3>
            <a href='' className='block text-xs'>
              Customer Service
            </a>
            <a href='' className='block text-xs'>
              Contact
            </a>
          </div>
          <div className='w-1/3 space-y-2 text-center text-white'>
            <h3 className='text-sm font-semibold'>Legal</h3>
            <a href='' className='block text-xs'>
              Privacy Policy
            </a>
            <a href='' className='block text-xs'>
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
