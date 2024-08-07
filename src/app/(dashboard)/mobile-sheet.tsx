import {
  HeartIcon,
  LogOutIcon,
  SparklesIcon,
  UserCircleIcon,
} from 'lucide-react';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { AvatarWithBadge } from '@/components/avatar-with-badge';
import { RightSidebar } from '@/components/sidebar/right-sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function MobileSheet({ session }: { session?: Session }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const menu = [
    {
      icon: UserCircleIcon,
      title: 'Profil',
      url: `/users/${session?.user.username}`,
    },
    {
      icon: SparklesIcon,
      title: 'Premium',
      url: '/premium',
    },
    {
      icon: HeartIcon,
      title: 'Favorit',
      url: '/favorite',
    },
  ];

  if (!session) {
    return (
      <div className='space-x-3 py-2 md:py-0 md:mt-6 md:px-4'>
        <Link
          className='rounded-lg bg-[#F48C06] px-3 py-1 font-semibold text-white shadow-md md:px-4 md:py-2'
          href='/auth/sign-in'
        >
          Masuk
        </Link>
        <Link
          className='rounded-lg bg-[#77425A] px-3 py-1 font-semibold text-white shadow-md md:px-4 md:py-2'
          href='/auth/sign-up'
        >
          Daftar
        </Link>
      </div>
    );
  }

  const closeSheet = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div>
          <AvatarWithBadge user={session.user} />
        </div>
      </SheetTrigger>
      <SheetContent className='text-[#696984] overflow-y-auto'>
        <div className='w-fit space-y-3'>
          <AvatarWithBadge
            user={session.user}
            classNames='h-16 w-16'
            badgeSize='lg'
          />
          <div className='text-left'>
            <h2 className='font-medium truncate max-w-[10rem]'>
              {session.user?.name}
            </h2>
            <p className='truncate max-w-[10rem]'>@{session.user?.username}</p>
          </div>
        </div>
        <div className='mt-4 space-y-4'>
          {menu.map((mn) => {
            return (
              <Link
                key={mn.title}
                className='flex w-fit items-center space-x-6'
                href={mn.url}
                onClick={() => {
                  setOpen(false);
                }}
                tabIndex={-1}
              >
                <mn.icon
                  className='mr-2'
                  size={28}
                  strokeWidth={pathname.startsWith(mn.url) ? 2 : 1}
                />
                {mn.title}
              </Link>
            );
          })}
          <button
            type='button'
            className='flex w-fit items-center space-x-6'
            onClick={async () =>
              signOut({
                callbackUrl: '/auth/sign-in',
              })
            }
            tabIndex={-1}
          >
            <LogOutIcon className='mr-2' size={28} strokeWidth={1} />
            Sign out
          </button>
        </div>
        <div className='mt-6 pt-6 border-t-2'>
          <RightSidebar setSheetOpen={closeSheet} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
