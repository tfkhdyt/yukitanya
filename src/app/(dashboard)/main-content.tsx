'use client';

import clsx from 'clsx';
import { AlignJustifyIcon, CheckCheckIcon } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { match, P } from 'ts-pattern';

import { ProfileButton } from '@/components/sidebar/profile-button';
import { Sidebar } from '@/components/sidebar/sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { mapel } from '@/constants/mapel';
import { type User } from '@/server/auth';
import { useSidebarStore } from '@/stores/sidebar';

export function MainContent({
  children,
  user,
}: {
  children: ReactNode;
  user: User | undefined;
}) {
  const pathname = usePathname();
  const sidebarStore = useSidebarStore();
  const parameters = useParams();

  let username = '';
  if (pathname.startsWith('/users/')) {
    username = parameters.username as string;
  }

  return (
    <main className='w-full md:w-2/3 lg:w-2/4'>
      <div className='sticky top-0 z-50 flex items-center justify-between border-b-2 bg-white/75 p-3 backdrop-blur-md'>
        <div className='flex items-center'>
          <div className='mr-4 md:hidden'>
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
              .with(P.string.startsWith('/home'), () => 'Beranda')
              .with(P.string.startsWith('/search'), () => 'Cari')
              .with(P.string.startsWith('/notifications'), () => 'Notifikasi')
              .with(P.string.startsWith('/questions'), () => 'Pertanyaan')
              .with(P.string.startsWith('/users'), () => `@${username}`)
              .with(
                P.string.startsWith('/subjects/') && P.string.minLength(11),
                () => (
                  <button className='flex items-center'>
                    <p className='decoration-2'>
                      {mapel.find((mpl) => mpl.id === parameters.id)?.name ??
                        '404'}
                    </p>
                  </button>
                ),
              )
              .with(P.string.startsWith('/subjects'), () => 'Mata Pelajaran')
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
            // pathname.startsWith('/questions/') && 'hidden',
          )}
        >
          <ProfileButton user={user} />
        </div>
      </div>
      <div>{children}</div>
    </main>
  );
}
