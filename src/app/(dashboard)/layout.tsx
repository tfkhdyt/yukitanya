'use client';

import { AlignJustify, PencilIcon } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { match } from 'ts-pattern';

import { useSidebarStore } from '@/stores/sidebar';

import { Button } from '../_components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../_components/ui/sheet';
import { ProfileButton } from './home/sidebar/profile-button';
import { Sidebar } from './home/sidebar/sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const sidebarStore = useSidebarStore();

  return (
    <section className='flex font-poppins lg:container'>
      <aside className='sticky top-0 hidden h-screen border-r-2 md:inline md:w-1/3 lg:w-1/4'>
        <Sidebar />
      </aside>
      <main className='w-full md:w-2/3 lg:w-2/4'>
        <div className='sticky top-0 z-50 flex items-center justify-between border-b-2 bg-white/25 p-3 backdrop-blur'>
          <div className='flex items-center'>
            <div className='mr-4 md:hidden'>
              <Sheet
                open={sidebarStore.isOpen}
                onOpenChange={sidebarStore.toggle}
              >
                <SheetTrigger className='p-2' aria-label='Mobile nav'>
                  <AlignJustify color='#696984' />
                </SheetTrigger>
                <SheetContent side='left' className='px-3 py-8'>
                  <Sidebar isMobile />
                </SheetContent>
              </Sheet>
            </div>

            <h1 className='text-center text-lg font-semibold text-[#696984]'>
              {match(pathname)
                .with('/home', () => 'Beranda')
                .with('/search', () => 'Cari Pertanyaan')
                .with('/subjects', () => 'Mata Pelajaran')
                .with('/notifications', () => 'Notifikasi')
                .with('/favorite', () => 'Favorit')
                .otherwise(() => pathname.slice(1))}
            </h1>
          </div>
          <div className='mr-1 lg:hidden'>
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
        <div>{children}</div>
      </main>
      <aside className='sticky top-0 hidden h-screen w-1/4 space-y-4 border-l-2 p-6 text-2xl font-extrabold text-[#F48C06] lg:inline'>
        <h2 className='text-xl font-extrabold'>JANGAN MALU UNTUK BERTANYA!</h2>
        <Image
          src='/img/home/mari-bertanya.png'
          alt='Mari bertanya'
          width={168}
          height={129}
        />
        <Button className='flex items-center space-x-2 rounded-full font-extrabold'>
          <p>Tanyakan Sekarang!</p>
          <PencilIcon size={16} />
        </Button>
      </aside>
    </section>
  );
}
