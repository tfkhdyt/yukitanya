'use client';

import { Bell, Book, Heart, HomeIcon, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { match } from 'ts-pattern';

import { ProfileButton } from './profile-button';

export function Sidebar() {
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

  return (
    <aside className='sticky top-0 h-screen w-1/4 border-r-2'>
      <nav className='space-y-8 p-6 text-[#696984]'>
        <div className='ml-4 flex items-end space-x-2'>
          <Image
            src='/img/yukitanya_logo.png'
            alt='Yukitanya Logo'
            width={54}
            height={49}
          />
          <span className='font-rubik text-2xl font-extrabold text-black'>
            Yukitanya
          </span>
        </div>
        <div className='space-y-2'>
          {menu.map((each) => (
            <Link
              key={each.title}
              className='flex w-fit items-center space-x-6 rounded-full border-2 border-white px-4 py-3 transition hover:border-[#F48C06]'
              href={each.url}
            >
              {match(pathname)
                .with(each.url, () => (
                  <>
                    <each.icon size={28} strokeWidth={2} />
                    <p className='text-xl font-semibold'>{each.title}</p>
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
          <ProfileButton
            fullName='Taufik Hidayat'
            username='tfkhdyt'
            avatar={{
              imageUrl: 'https://github.com/tfkhdyt.png',
              fallback: 'TH',
            }}
          />
        </div>
      </nav>
    </aside>
  );
}
