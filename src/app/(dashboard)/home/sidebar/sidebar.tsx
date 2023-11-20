'use client';

import { type User } from '@/server/auth';
import { useSidebarStore } from '@/stores/sidebar';
import { Bell, Book, Heart, HomeIcon, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { P, match } from 'ts-pattern';

import { ProfileButton } from './profile-button';

export function Sidebar({
  isMobile = false,
  user,
}: {
  isMobile?: boolean;
  user: User | undefined;
}) {
  const menu = [
    {
      icon: HomeIcon,
      title: 'Beranda',
      url: '/home',
    },
    {
      icon: Search,
      title: 'Cari Pertanyaan',
      url: '/search',
    },
    {
      icon: Book,
      title: 'Mata Pelajaran',
      url: '/subjects',
    },
    {
      icon: Bell,
      title: 'Notifikasi',
      url: '/notifications',
    },
    {
      icon: Heart,
      title: 'Favorit',
      url: '/favorite',
    },
  ];
  const pathname = usePathname();
  const toggleSidebar = useSidebarStore((state) => state.toggle);

  return (
    <nav className='space-y-6 text-[#696984] md:p-3 lg:space-y-8 lg:p-6'>
      <div className='ml-4 flex items-end space-x-2'>
        <Image
          alt='Yukitanya Logo'
          className='h-10 w-auto'
          height={49}
          src='/img/yukitanya_logo.png'
          width={54}
        />
        <span className='font-rubik text-xl font-extrabold text-black lg:text-2xl'>
          Yukitanya
        </span>
      </div>
      <div className='space-y-1 lg:space-y-2'>
        {menu.map((each) => (
          <Link
            className='flex w-fit items-center space-x-6 rounded-full border-2 border-transparent px-4 py-3 transition hover:border-[#F48C06]'
            href={each.url}
            key={each.title}
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
            avatar={{
              fallback: user?.initial ?? '',
              imageUrl: user?.image ?? '',
            }}
            fullName={user?.name ?? ''}
            username={user?.username ?? ''}
          />
        </div>
      </div>
    </nav>
  );
}
