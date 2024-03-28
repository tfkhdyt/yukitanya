'use client';

import { Facebook, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ScrollIntoView from 'react-scroll-into-view';

export function Footer({ scroll = false }: { scroll?: boolean }) {
  const fitur = [
    { id: 'forum-tanya-jawab', name: 'Forum tanya jawab' },
    { id: 'speech-to-text', name: 'Speech to text' },
    { id: 'chat-room', name: "Course's chat room" },
    { id: 'private-chat', name: 'Private chat' },
  ];

  return (
    <section className='bg-[#77425A]'>
      <div className='container divide-y-2 md:px-12'>
        <div className='grid grid-cols-1 gap-8 px-2 py-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3'>
          <div className='flex items-center space-x-3'>
            <Image
              alt='Yukitanya Logo'
              className='-mt-4'
              height={57}
              src='/img/yukitanya_logo.png'
              width={60}
            />
            <p className='font-rubik text-2xl font-extrabold text-white'>
              Yukitanya
            </p>
          </div>
          <p className='text-sm text-white md:text-right md:text-base lg:text-center'>
            © 2023 Copyright Kelompok 5 seKODlah Developing Future Tech
            Innovators{' '}
          </p>
          <div className='space-x-4 md:mt-6 lg:mt-auto lg:justify-self-end'>
            <button
              aria-label='Facebook'
              className='rounded-lg bg-white p-2'
              type='button'
            >
              <Facebook />
            </button>
            <button
              aria-label='Instagram'
              className='rounded-lg bg-white p-2'
              type='button'
            >
              <Instagram />
            </button>
            <button
              aria-label='Twitter'
              className='rounded-lg bg-white p-2'
              type='button'
            >
              <Twitter />
            </button>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-8 py-8 md:grid-cols-3'>
          <div className='space-y-2 text-center text-white'>
            <h3 className='font-semibold md:text-sm'>Fitur</h3>
            {fitur.map((each) => {
              if (scroll) {
                return (
                  <ScrollIntoView
                    className='block cursor-pointer text-sm md:text-xs'
                    key={each.id}
                    selector={`#${each.id}`}
                  >
                    {each.name}
                  </ScrollIntoView>
                );
              }

              return (
                <Link
                  className='block cursor-pointer text-sm md:text-xs'
                  href={`/#${each.id}`}
                  key={each.id}
                >
                  {each.name}
                </Link>
              );
            })}
          </div>
          <div className='space-y-2 text-center text-white'>
            <h3 className='font-semibold md:text-sm'>Help</h3>
            <a className='block text-sm md:text-xs' href='/'>
              Customer Service
            </a>
            <a className='block text-sm md:text-xs' href='/'>
              Contact
            </a>
          </div>
          <div className='space-y-2 text-center text-white'>
            <h3 className='font-semibold md:text-sm'>Legal</h3>
            <a className='block text-sm md:text-xs' href='/'>
              Privacy Policy
            </a>
            <a className='block text-sm md:text-xs' href='/'>
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
