'use client';

import Image from 'next/image';
import { Element } from 'react-scroll';

type TKeunggulan = {
  image: {
    url: string;
    alt: string;
  };
  text: string;
};

export function Keunggulan() {
  const keunggulan: TKeunggulan[] = [
    {
      image: {
        url: '/img/fitur/unik.svg',
        alt: 'Fitur unik',
      },
      text: 'Memiliki fitur yang berbeda dari web lainnya karena dapat memfasilitasi para siswa SD untuk saling berdiskusi mengenai mata pelajaran SD.',
    },
    {
      image: {
        url: '/img/fitur/menarik.svg',
        alt: 'Tampilan menarik',
      },
      text: 'Tampilan platform menarik dan sederhana. Sehingga memudahkan pengguna untuk mencari fitur yang ada pada platform.',
    },
    {
      image: {
        url: '/img/fitur/verifikasi.svg',
        alt: 'Verifikasi Jawaban',
      },
      text: 'Memiliki fitur verifikasi jawaban untuk menilai keakuratan dari jawaban tersebut sehingga memperkuat tingkat kebenarannya.',
    },
  ];

  return (
    <Element
      name='keunggulan'
      className='-mt-1 bg-[url(/img/fitur/bg.svg)] bg-cover py-12 lg:mt-0'
    >
      <div className='container space-y-12 font-poppins md:px-16 lg:px-0'>
        <p className='text-center text-2xl font-bold text-[#F48C06]'>
          <span className='text-[#77425A]'>Keunggulan</span> Platform Kami
        </p>
        <p className='mx-auto max-w-4xl text-center leading-loose text-[#696984] md:text-lg md:leading-loose'>
          Yukitanya adalah salah satu platform tanya jawab online yang
          menggabungkan semua alat yang diperlukan untuk menunjang tugas
          sekolah.
        </p>
        <div className='grid grid-cols-1 gap-48 pb-96 pt-40 md:grid-cols-3 md:gap-16'>
          {keunggulan.map((each) => (
            <div
              className='relative flex rounded-2xl bg-white px-6 py-20 shadow-lg lg:px-12 lg:py-24'
              key={each.text}
            >
              <Image
                src={each.image.url}
                width={146}
                height={179}
                alt={each.image.alt}
                className='absolute inset-x-0 -top-32 mx-auto'
              />
              <p className='text-center text-sm font-medium leading-loose text-[#77425A] lg:text-base'>
                {each.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Element>
  );
}
