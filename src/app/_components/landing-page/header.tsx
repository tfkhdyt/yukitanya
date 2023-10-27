'use client';

import { useWindowScroll } from '@uidotdev/usehooks';
import clsx from 'clsx';
import { AlignJustify } from 'lucide-react';
import Image from 'next/image';
import ScrollIntoView from 'react-scroll-into-view';

import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';

type Navbar = {
  id: string;
  title: string;
};

export function Header() {
  const navbar: Navbar[] = [
    {
      id: 'home',
      title: 'Home',
    },
    {
      id: 'tentang-kami',
      title: 'Tentang Kami',
    },
    {
      id: 'keunggulan',
      title: 'Keunggulan',
    },
    {
      id: 'fitur',
      title: 'Fitur',
    },
  ];
  const [{ y }] = useWindowScroll();

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-10 transition-all',
        y && y > 30 && 'border-b-2 bg-white/50 backdrop-blur',
      )}
    >
      <div className='container flex items-center justify-between py-6 md:px-12'>
        <div className='flex items-center space-x-3'>
          <Image
            src='/img/yukitanya_logo.png'
            alt='Yukitanya Logo'
            width={60}
            height={57}
            className='-mt-4'
          />
          <p className='font-rubik text-2xl font-extrabold'>Yukitanya</p>
        </div>
        <Sheet>
          <SheetTrigger className='p-2 lg:hidden' aria-label='Mobile nav'>
            <AlignJustify />
          </SheetTrigger>
          <SheetContent className='flex w-fit flex-col space-y-4 pt-12 font-poppins'>
            {navbar.map((each) => (
              <SheetClose asChild key={each.id}>
                <ScrollIntoView
                  selector={`#${each.id}`}
                  className='cursor-pointer text-[#696984]'
                >
                  {each.title}
                </ScrollIntoView>
              </SheetClose>
            ))}
            <div className='space-x-3'>
              <button className='rounded-lg bg-[#F48C06] px-4 py-2 font-bold text-white shadow-md'>
                Masuk
              </button>
              <button className='rounded-lg bg-[#77425A] px-4 py-2 font-bold text-white shadow-md'>
                Daftar
              </button>
            </div>
          </SheetContent>
        </Sheet>

        <nav className='hidden items-center space-x-12 font-poppins lg:flex'>
          {navbar.map((each) => (
            <ScrollIntoView
              key={each.id}
              selector={`#${each.id}`}
              className='cursor-pointer text-[#696984]'
            >
              {each.title}
            </ScrollIntoView>
          ))}
          <div className='space-x-3'>
            <button className='rounded-lg bg-[#F48C06] px-4 py-2 font-bold text-black shadow-md'>
              Masuk
            </button>
            <button className='rounded-lg bg-[#77425A] px-4 py-2 font-bold text-white shadow-md'>
              Daftar
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
