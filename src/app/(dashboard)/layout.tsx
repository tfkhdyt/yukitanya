'use client';

import { mapel } from '@/constants/mapel';
import { useSidebarStore } from '@/stores/sidebar';
import clsx from 'clsx';
import {
  AlignJustify,
  ArrowLeft,
  CheckCheckIcon,
  PencilIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { type ReactNode } from 'react';
import { P, match } from 'ts-pattern';

import { Button } from '../_components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../_components/ui/sheet';
import { QuestionModal } from './home/question/question-modal';
import { ProfileButton } from './home/sidebar/profile-button';
import { Sidebar } from './home/sidebar/sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const sidebarStore = useSidebarStore();
  let username = '';
  if (pathname.startsWith('/users/')) {
    username = params.id as string;
  }

  return (
    <section className='flex lg:container'>
      <aside className='sticky top-0 hidden h-screen border-r-2 md:inline md:w-1/3 lg:w-1/4'>
        <Sidebar />
      </aside>
      <main className='w-full md:w-2/3 lg:w-2/4'>
        <div className='sticky top-0 z-50 flex items-center justify-between border-b-2 bg-white/25 p-3 backdrop-blur'>
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
                  <AlignJustify color='#696984' />
                </SheetTrigger>
                <SheetContent className='px-3 py-8' side='left'>
                  <Sidebar isMobile />
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
                        {mapel.find((mpl) => mpl.id === params.id)?.name ??
                          '404'}
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
            <ProfileButton
              avatar={{
                fallback: 'TH',
                imageUrl: 'https://github.com/tfkhdyt.png',
              }}
              fullName='Taufik Hidayat'
              username='tfkhdyt'
            />
          </div>
        </div>
        <div>{children}</div>
      </main>
      <aside className='sticky top-0 hidden h-screen w-1/4 space-y-4 border-l-2 p-6 text-2xl font-extrabold text-[#F48C06] lg:inline'>
        <h2 className='text-xl font-extrabold'>JANGAN MALU UNTUK BERTANYA!</h2>
        <Image
          alt='Mari bertanya'
          height={129}
          src='/img/home/mari-bertanya.png'
          width={168}
        />
        <QuestionModal
          avatar={{
            fallback: 'TH',
            imageUrl: 'https://github.com/tfkhdyt.png',
          }}
          fullName='Taufik Hidayat'
          username='tfkhdyt'
        >
          <Button className='flex items-center space-x-2 rounded-full font-semibold'>
            <PencilIcon size={16} />
            <p>Tanyakan Sekarang!</p>
          </Button>
        </QuestionModal>
      </aside>
    </section>
  );
}
