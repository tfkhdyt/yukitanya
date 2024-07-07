'use client';

import { cn } from '@/lib/utils';
import { BadgeXIcon, GithubIcon, LucideIcon, PanelTopIcon } from 'lucide-react';

type TKeunggulan = {
  image: {
    alt: string;
    Icon: LucideIcon;
  };
  text: string;
};

export function Keunggulan() {
  const keunggulan: TKeunggulan[] = [
    {
      image: {
        alt: 'Tanpa iklan',
        Icon: BadgeXIcon,
      },
      text: 'Platform ini menghadirkan pengalaman belajar tanpa gangguan iklan, memungkinkan siswa fokus sepenuhnya pada tugas dan diskusi.',
    },
    {
      image: {
        alt: 'User Interface yang clean dan friendly',
        Icon: PanelTopIcon,
      },
      text: 'Dengan antarmuka yang simpel dan intuitif, aplikasi ini memudahkan setiap pengguna menjelajahi fitur-fitur tanpa kesulitan.',
    },
    {
      image: {
        alt: 'Free and Open Source',
        Icon: GithubIcon,
      },
      text: 'Platform ini tidak hanya gratis, tetapi juga open source, memberi kebebasan bagi siapa saja untuk mengakses, mengkustomisasi, dan berkontribusi.',
    },
  ];

  return (
    <section
      className='-mt-1 scroll-mt-20 bg-[url(/img/fitur/bg.svg)] bg-cover py-12 lg:mt-0'
      id='keunggulan'
    >
      <div className='container space-y-12 md:px-16'>
        <p className='text-center text-2xl font-bold text-[#F48C06]'>
          <span className='text-[#77425A]'>Keunggulan</span> Platform Kami
        </p>
        <p className='mx-auto max-w-4xl text-center leading-loose text-[#696984] md:text-lg md:leading-loose'>
          Yukitanya adalah salah satu platform tanya jawab online yang
          menggabungkan semua alat yang diperlukan untuk menunjang tugas
          sekolah.
        </p>
        <div className='grid grid-cols-1 gap-48 pb-96 pt-40 md:grid-cols-3 md:gap-16'>
          {keunggulan.map((each, idx) => (
            <div
              className='relative flex rounded-2xl bg-white px-6 py-20 shadow-lg lg:px-12 lg:py-16'
              key={each.text}
            >
              <div
                className={cn(
                  idx % 2 === 0 ? 'bg-stone-600' : 'bg-amber-500',
                  'absolute inset-x-0 -top-12 mx-auto p-6 w-fit rounded-full shadow-md',
                )}
              >
                <each.image.Icon className='text-white' size={48} />
              </div>
              <p className='text-center text-sm font-medium leading-loose text-[#77425A] lg:text-base'>
                {each.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
