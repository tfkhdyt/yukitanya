'use client';

import clsx from 'clsx';
import { AlignJustifyIcon, ArrowLeft, CheckCheckIcon } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { type ReactNode } from 'react';
import { match, P } from 'ts-pattern';

import { mapel } from '@/constants/mapel';
import { type User } from '@/server/auth';
import { useSidebarStore } from '@/stores/sidebar';

import { Sheet, SheetContent, SheetTrigger } from '../_components/ui/sheet';
import { ProfileButton } from './home/sidebar/profile-button';
import { Sidebar } from './home/sidebar/sidebar';

export function MainContent({
  children,
  user,
}: {
  children: ReactNode;
  user: User | undefined;
}) {
  const pathname = usePathname();
  const sidebarStore = useSidebarStore();
  const params = useParams();
  const router = useRouter();

  let username = '';
  if (pathname.startsWith('/users/')) {
    username = params.id as string;
  }

  return (
    <main className='w-full md:w-2/3 lg:w-2/4'>
      <div className='sticky top-0 z-50 flex items-center justify-between border-b-2 bg-white/75 p-3 backdrop-blur-md'>
        <div className='flex items-center'>
          <div
            className={clsx(
              'mr-4 md:hidden',
              pathname.startsWith('/questions/') && 'hidden',
            )}
          >
            <Sheet
              onOpenChange={sidebarStore.toggle}
              open={sidebarStore.isOpen}
            >
              <SheetTrigger aria-label='Mobile nav' className='p-2'>
                <AlignJustifyIcon color='#696984' />
              </SheetTrigger>
              <SheetContent className='px-3 py-8' side='left'>
                <Sidebar isMobile user={user} />
              </SheetContent>
            </Sheet>
          </div>

          <div className='text-center text-lg font-medium text-[#696984]'>
            {match(pathname)
              .with('/home', () => 'Beranda')
              .with('/search', () => 'Cari Pertanyaan')
              .with('/subjects', () => 'Mata Pelajaran')
              .with('/notifications', () => 'Notifikasi')
              .with('/favorite', () => 'Favorit')
              .with(P.string.startsWith('/questions/'), () => (
                <button
                  className='flex items-center space-x-3'
                  onClick={() => router.back()}
                >
                  <ArrowLeft />
                  <p className='decoration-2 hover:underline'>Kembali</p>
                </button>
              ))
              .with(P.string.startsWith('/users/'), () => (
                <button
                  className='flex items-center space-x-3'
                  onClick={() => router.back()}
                >
                  <ArrowLeft />
                  <p className='decoration-2 hover:underline'>{username}</p>
                </button>
              ))
              .with(
                P.string.startsWith('/subjects/') && P.string.minLength(11),
                () => (
                  <button className='flex items-center'>
                    <p className='decoration-2'>
                      {mapel.find((mpl) => mpl.id === params.id)?.name ?? '404'}
                    </p>
                  </button>
                ),
              )
              .otherwise(() => pathname.slice(1))}
          </div>
        </div>
        {pathname.startsWith('/notifications') && (
          <button className='ml-auto' title='Tandai semua sudah dibaca'>
            <CheckCheckIcon color='#696984' />
          </button>
        )}

        <div
          className={clsx(
            'ml-4 mr-1 lg:hidden',
            pathname.startsWith('/questions/') && 'hidden',
          )}
        >
          <ProfileButton user={user} />
        </div>
      </div>
      <div>{children}</div>
    </main>
  );
}
