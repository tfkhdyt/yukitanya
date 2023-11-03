'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { match } from 'ts-pattern';

import { Sidebar } from '../_components/home/sidebar/sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <section className='container flex font-poppins'>
      <Sidebar />
      <main className='relative w-2/4'>
        <div className='sticky top-0 bg-white/50 p-3 backdrop-blur'>
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
        <div className='border-t-2'>{children}</div>
      </main>
      <aside className='h-screen w-1/4 border-l-2 text-2xl font-extrabold text-[#F48C06]'>
        <h2 className='p-6 leading-relaxed'>
          AYO BANTU TEMAN MENEMUKAN JAWABAN NYA!
        </h2>
      </aside>
    </section>
  );
}
