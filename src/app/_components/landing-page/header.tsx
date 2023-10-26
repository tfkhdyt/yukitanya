'use client';

import { useWindowScroll } from '@uidotdev/usehooks';
import clsx from 'clsx';
import Image from 'next/image';
import { Link } from 'react-scroll';

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
        'fixed inset-x-0 top-0 z-10 transition',
        y && y > 30 && 'border-b-2 bg-white/50 backdrop-blur',
      )}
    >
      <div className='container mx-auto flex items-center justify-between px-4 py-6'>
        <div className='flex items-center space-x-3'>
          <Image
            src='/img/yukitanya_logo.svg'
            alt='Yukitanya Logo'
            width={60}
            height={57}
            className='-mt-4'
          />
          <p className='font-rubik text-2xl font-extrabold'>Yukitanya</p>
        </div>

        <nav className='flex items-center space-x-12 font-poppins'>
          {navbar.map((each) => (
            <Link
              to={each.id}
              smooth
              className='cursor-pointer text-[#696984]'
              key={each.id}
              offset={each.id !== 'home' ? -100 : undefined}
            >
              {each.title}
            </Link>
          ))}
          <div className='space-x-3'>
            <button className='rounded-lg bg-[#F48C06] px-4 py-2 font-bold text-white shadow-md'>
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
