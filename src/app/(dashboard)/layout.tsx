'use client';

import { PencilIcon } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { match } from 'ts-pattern';

import { Sidebar } from '../_components/home/sidebar/sidebar';
import { Button } from '../_components/ui/button';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <section className='flex font-poppins lg:container'>
      <Sidebar />
      <main className='md:w-3/4 lg:w-2/4'>
        <div className='sticky top-0 z-50 border-b-2 bg-white/25 p-3 backdrop-blur'>
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
        <div>{children}</div>
      </main>
      <aside className='sticky top-0 hidden h-screen w-1/4 space-y-4 border-l-2 p-6 text-2xl font-extrabold text-[#F48C06] lg:inline'>
        <h2 className='text-xl font-extrabold'>
          AYO BERTANYA, JANGAN MALU-MALU!
        </h2>
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
