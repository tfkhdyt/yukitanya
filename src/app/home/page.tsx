'use client';

import {
  BellIcon,
  Book,
  Heart,
  HomeIcon,
  Link,
  MessageCircle,
  MoreHorizontal,
  PencilIcon,
  Search,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '../_components/ui/avatar';
import { Badge } from '../_components/ui/badge';
import { Button } from '../_components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../_components/ui/dropdown-menu';

export default function Home() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <section className='container flex font-poppins'>
      <aside className='h-screen w-1/4 border-r-2'>
        <nav className='space-y-8 p-6 text-[#696984]'>
          <div className='ml-4 flex items-end space-x-2'>
            <Image
              src='/img/yukitanya_logo.png'
              alt='Yukitanya Logo'
              width={54}
              height={49}
            />
            <span className='font-rubik text-2xl font-extrabold text-black'>
              Yukitanya
            </span>
          </div>
          <div className='space-y-2'>
            <button className='flex w-fit items-center space-x-6 rounded-full border-2 border-white px-4 py-3 transition hover:border-[#F48C06]'>
              <HomeIcon size={28} strokeWidth={2} />
              <p className='text-xl font-semibold'>Beranda</p>
            </button>
            <button className='flex w-fit items-center space-x-6 rounded-full border-2 border-white px-4 py-3 transition hover:border-[#F48C06]'>
              <Search size={28} strokeWidth={1} />
              <p className='text-xl font-light'>Cari Pertanyaan</p>
            </button>
            <button className='flex w-fit items-center space-x-6 rounded-full border-2 border-white px-4 py-3 transition hover:border-[#F48C06]'>
              <Book size={28} strokeWidth={1} />
              <p className='text-xl font-light'>Mata Pelajaran</p>
            </button>
            <button className='flex w-fit items-center space-x-6 rounded-full border-2 border-white px-4 py-3 transition hover:border-[#F48C06]'>
              <BellIcon size={28} strokeWidth={1} />
              <p className='text-xl font-light'>Notifikasi</p>
            </button>
            <button className='flex w-fit items-center space-x-6 rounded-full border-2 border-white px-4 py-3 transition hover:border-[#F48C06]'>
              <Heart size={28} strokeWidth={1} />
              <p className='text-xl font-light'>Favorit</p>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className='flex w-fit items-center space-x-3 rounded-full border-2 border-white px-4 py-3 transition hover:border-[#F48C06]'>
                <Avatar>
                  <AvatarImage src='https://github.com/tfkhdyt.png' />
                  <AvatarFallback>TH</AvatarFallback>
                </Avatar>
                <div className='pr-4 text-left'>
                  <h2 className='font-semibold'>Taufik Hidayat</h2>
                  <p>@tfkhdyt</p>
                </div>
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='font-poppins text-[#696984]'>
                <DropdownMenuLabel>@tfkhdyt</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </aside>
      <main className='w-2/4'>
        <div className='border-b-2 p-3'>
          <h1 className='text-center text-lg font-semibold text-[#696984]'>
            Beranda
          </h1>
        </div>
        <div className='flex border-b-2 p-6'>
          <div className='w-2/3 space-y-6'>
            <h2 className='text-xl font-extrabold'>
              AYO BERTANYA, JANGAN MALU-MALU YA...!
            </h2>
            <Button className='flex items-center space-x-2 rounded-full font-extrabold'>
              <p>Tanyakan Sekarang!</p>
              <PencilIcon size={16} />
            </Button>
          </div>
          <div className='w-1/3'>
            <Image
              src='/img/home/mari-bertanya.png'
              alt='Mari bertanya'
              width={168}
              height={129}
              className='mx-auto'
            />
          </div>
        </div>
        <div className='flex space-x-3 border-b-2 p-6'>
          <Avatar>
            <AvatarImage src='https://github.com/tfkhdyt.png' />
            <AvatarFallback>TH</AvatarFallback>
          </Avatar>
          <div className='space-y-1'>
            <div className='flex space-x-2 text-[#696984]'>
              <p className='font-semibold'>Taufik Hidayat</p>
              <p className='font-light'>@tfkhdyt</p>
              <p>•</p>
              <p>24m</p>
            </div>
            <p className='py-1 text-sm leading-relaxed text-[#696984]'>
              Pada masa Daulah Abbasiyah, kedudukan kaum muslim di Bagdad berada
              .... a. lebih tinggi daripada warga lainnya b. sejajar dengan
              warga lainnya c. lebih rendah daripada warga lainnya d. sebagai
              warga yang istimewa​
            </p>
            <div className='flex justify-between pt-2'>
              <div className='space-x-1'>
                <Badge variant='secondary' className='hover:bg-slate-200'>
                  <button>Sejarah</button>
                </Badge>
                <Badge variant='secondary' className='hover:bg-slate-200'>
                  <button>Pendidikan Agama Islam</button>
                </Badge>
              </div>
              <div className='flex items-center space-x-1'>
                <Star size={18} color='#F48C06' fill='#F48C06' />
                <Star size={18} color='#F48C06' fill='#F48C06' />
                <Star size={18} color='#F48C06' fill='#F48C06' />
                <Star size={18} color='#F48C06' fill='#F48C06' />
                <Star size={18} color='#F48C06' />
              </div>
            </div>
            <div className='space-x-2 pt-2 text-[#696984]'>
              <Button
                size='sm'
                variant='outline'
                className='rounded-full text-sm'
              >
                <MessageCircle size={18} className='mr-2' />
                Lihat jawaban (2)
              </Button>
              <Button
                size='sm'
                variant='outline'
                className='rounded-full text-sm'
              >
                <Heart size={18} className='mr-2' />
                Favorit (5)
              </Button>
              <Button
                size='sm'
                variant='outline'
                className='rounded-full text-sm'
              >
                <Link size={18} className='mr-2' />
                Salin link
              </Button>
            </div>
          </div>
        </div>
      </main>
      <aside className='h-screen w-1/4 border-l-2 text-2xl font-extrabold text-[#F48C06]'>
        <h2 className='p-6 leading-relaxed'>
          AYO BANTU TEMAN MENEMUKAN JAWABAN NYA!
        </h2>
      </aside>
    </section>
  );
}
