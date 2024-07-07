'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { P, match } from 'ts-pattern';

import { menu } from '@/constants/menu';
import { useSidebarStore } from '@/stores/sidebar';
import type { Session } from 'next-auth';
import { TanyakanSekarangButton } from '../buttons/tanyakan-sekarang';
import { NotifCount } from '../notif-counter';
import { ProfileButton } from './profile-button';
import { RightSidebar } from './right-sidebar';

export function LeftSidebar({
  isMobile = false,
  session,
}: {
  isMobile?: boolean;
  session?: Session;
}) {
  const pathname = usePathname();
  const toggleSidebar = useSidebarStore((state) => state.toggle);

  return (
    <nav className='space-y-6 text-[#696984] md:p-6 lg:space-y-8'>
      <div className='ml-4 flex items-end space-x-2'>
        <Image
          alt='Yukitanya Logo'
          className='h-10 w-auto'
          height={49}
          src='/img/yukitanya_logo.png'
          width={54}
        />
        <span className='font-rubik text-xl font-extrabold text-black lg:text-2xl'>
          {match(session?.user.membership?.type)
            .with('standard', () => 'Premium')
            .with('plus', () => 'Premium+')
            .otherwise(() => 'Yukitanya')}
        </span>
      </div>
      <div className='space-y-1 lg:space-y-2'>
        {menu.map((each) => {
          if (each.title === 'Notifikasi' && !session?.user) return;
          if (each.title === 'Buat') return;
          if (each.title === 'Premium' && !session?.user) return;
          if (each.title === 'Favorit' && !session?.user) return;

          return (
            <Link
              className='flex w-fit items-center space-x-6 rounded-full border-2 border-transparent px-4 py-3 transition hover:border-[#F48C06] relative'
              href={each.url}
              key={each.title}
              onClick={isMobile ? toggleSidebar : undefined}
              aria-label={each.title}
            >
              {match(pathname)
                .with(P.string.startsWith(each.url), () => (
                  <>
                    <each.icon size={28} strokeWidth={2} />
                    {each.url === '/notifications' && session?.user && (
                      <NotifCount userId={session?.user?.id} />
                    )}
                    <p className='text-xl font-medium'>{each.title}</p>
                  </>
                ))
                .otherwise(() => (
                  <>
                    <each.icon size={28} strokeWidth={1} />
                    {each.url === '/notifications' && session?.user && (
                      <NotifCount userId={session.user.id} />
                    )}
                    <p className='text-xl font-light'>{each.title}</p>
                  </>
                ))}
            </Link>
          );
        })}
        <div className='hidden md:block'>
          <ProfileButton user={session?.user} />
        </div>
        <div className='pt-2'>
          {session && <TanyakanSekarangButton user={session?.user} fullWidth />}
        </div>
      </div>
      <div className='hidden md:block lg:hidden'>
        <RightSidebar />
      </div>
    </nav>
  );
}
