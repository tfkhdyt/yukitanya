'use client';

import { Bell, Book, Heart, HomeIcon, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { P, match } from 'ts-pattern';

import { useSidebarStore } from '@/stores/sidebar';

import { ProfileButton } from './profile-button';

export function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
  const menu = [
    {
      title: 'Beranda',
      icon: HomeIcon,
      url: '/home',
    },
    {
      title: 'Cari Pertanyaan',
      icon: Search,
      url: '/search',
    },
    {
      title: 'Mata Pelajaran',
      icon: Book,
      url: '/subjects',
    },
    {
      title: 'Notifikasi',
      icon: Bell,
      url: '/notifications',
    },
    {
      title: 'Favorit',
      icon: Heart,
      url: '/favorite',
    },
  ];
  const pathname = usePathname();
  const toggleSidebar = useSidebarStore((state) => state.toggle);

  return (
    <nav className='space-y-6 text-[#696984] md:p-3 lg:space-y-8 lg:p-6'>
      <div className='ml-4 flex items-end space-x-2'>
        <Image
          src='/img/yukitanya_logo.png'
          alt='Yukitanya Logo'
          width={54}
          height={49}
          className='h-10 w-auto'
        />
        <span className='font-rubik text-xl font-extrabold text-black lg:text-2xl'>
          Yukitanya
        </span>
      </div>
      <div className='space-y-1 lg:space-y-2'>
        {menu.map((each) => (
          <Link
            key={each.title}
            className='flex w-fit items-center space-x-6 rounded-full border-2 border-transparent px-4 py-3 transition hover:border-[#F48C06]'
            href={each.url}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            {match(pathname)
              .with(P.string.startsWith(each.url), () => (
                <>
                  <each.icon size={28} strokeWidth={2} />
                  <p className='text-xl font-medium'>{each.title}</p>
                </>
              ))
              .otherwise(() => (
                <>
                  <each.icon size={28} strokeWidth={1} />
                  <p className='text-xl font-light'>{each.title}</p>
                </>
              ))}
          </Link>
        ))}
        <div className='hidden lg:block'>
          <ProfileButton
            fullName='Taufik Hidayat'
            username='tfkhdyt'
            avatar={{
              imageUrl: 'https://github.com/tfkhdyt.png',
              fallback: 'TH',
            }}
          />
        </div>
      </div>
    </nav>
  );
}
