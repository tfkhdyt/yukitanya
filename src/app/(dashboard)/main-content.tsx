'use client';

import clsx from 'clsx';
import { CheckCheckIcon } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { P, match } from 'ts-pattern';

import { mapel } from '@/constants/mapel';
import { api } from '@/trpc/react';
import type { Session } from 'next-auth';
import { MobileNav } from './mobile-nav';
import { MobileSheet } from './mobile-sheet';

export function MainContent({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  const pathname = usePathname();
  const parameters = useParams();

  let username = '';
  if (pathname.startsWith('/users/')) {
    username = parameters.username as string;
  }

  const utils = api.useUtils();
  const markAllHasBeenReadMutation =
    api.notification.markAllHasBeenRead.useMutation({
      onError: () => toast.error('Gagal menandai semua notifikasi'),
      onSuccess: () => utils.notification.invalidate(),
    });

  const handleAllRead = () => {
    if (session?.user?.id) markAllHasBeenReadMutation.mutate(session.user.id);
  };

  let isAllHasBeenRead;

  if (session?.user?.id) {
    isAllHasBeenRead = api.notification.isAllNotifHasBeenRead.useQuery(
      session.user.id,
    );
  }

  return (
    <main className='w-full md:w-2/3 lg:w-2/4'>
      <div className='sticky top-0 z-50 flex items-center justify-between border-b-2 bg-white/75 py-3 px-4 backdrop-blur-md'>
        <div className='flex items-center'>
          <div className='text-center text-lg font-medium text-[#696984]'>
            {match(pathname)
              .with(P.string.startsWith('/home'), () => 'Beranda')
              .with(P.string.startsWith('/search'), () => 'Cari')
              .with(P.string.startsWith('/notifications'), () => 'Notifikasi')
              .with(P.string.startsWith('/questions'), () => 'Pertanyaan')
              .with(P.string.startsWith('/premium'), () => 'Premium')
              .with(P.string.startsWith('/favorite'), () => 'Favorit')
              .with(P.string.startsWith('/users'), () => (
                <span className='max-w-[9rem] truncate'>@{username}</span>
              ))
              .with(
                P.string.startsWith('/subjects/') && P.string.minLength(11),
                () =>
                  mapel.find((mpl) => mpl.id === parameters.id)?.name ?? '404',
              )
              .with(P.string.startsWith('/subjects'), () => 'Mata Pelajaran')
              .otherwise(() => pathname.slice(1))}
          </div>
        </div>
        {pathname.startsWith('/notifications') &&
          isAllHasBeenRead?.data === false && (
            <button
              className='ml-auto'
              title='Tandai semua sudah dibaca'
              onClick={handleAllRead}
              type='button'
            >
              <CheckCheckIcon color='#696984' />
            </button>
          )}

        <div className={clsx('ml-4 mr-1 md:hidden')}>
          <MobileSheet session={session} />
        </div>
      </div>
      <div className='mb-20'>{children}</div>
      <MobileNav user={session?.user} />
    </main>
  );
}
